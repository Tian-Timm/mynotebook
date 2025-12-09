import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const LOCAL_CACHE_KEY = 'hyt_ideas_cache'

function readCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCache(list) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(list))
  } catch {
    void 0
  }
}

export function useIdeas() {
  const [ideas, setIdeas] = useState(readCache())
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && Array.isArray(data)) {
          if (!cancelled) {
            setIdeas(data)
            writeCache(data)
            setError(null)
          }
        } else {
          if (!cancelled) setError(error || null)
        }
      } catch (e) {
        console.log('useIdeas fetch error (likely offline):', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const addIdea = useCallback(
    async (content) => {
      const { data, error } = await supabase
        .from('ideas')
        .insert({ content })
        .select()
      if (error) throw error
      const inserted = Array.isArray(data) ? data[0] : null
      const next = inserted ? [inserted, ...ideas] : ideas
      writeCache(next)
      setIdeas(next)
      return inserted
    },
    [ideas]
  )

  const deleteIdea = useCallback(
    async (id) => {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)
      if (error) throw error
      const next = ideas.filter((i) => i.id !== id)
      writeCache(next)
      setIdeas(next)
    },
    [ideas]
  )

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && Array.isArray(data)) {
        writeCache(data)
        setIdeas(data)
        setError(null)
      }
    } catch (e) {
      console.log('useIdeas refresh error:', e)
    }
  }, [])

  return { ideas, error, refresh, addIdea, deleteIdea }
}
