import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const CACHE_KEY = 'ideas_cache'

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCache(list) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list))
  } catch {
    void 0
  }
}

let started = false

async function refreshIdeas() {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false })
  if (!error && Array.isArray(data)) {
    writeCache(data)
    window.dispatchEvent(new Event('ideas_cache_updated'))
  }
}

if (!started) {
  started = true
  Promise.resolve().then(() => refreshIdeas())
}

export function useIdeas() {
  const [ideas, setIdeas] = useState(readCache())
  const [error, setError] = useState(null)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CACHE_KEY) {
        setIdeas(readCache())
      }
    }
    const onUpdated = () => {
      setIdeas(readCache())
      setError(null)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('ideas_cache_updated', onUpdated)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('ideas_cache_updated', onUpdated)
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
      await refreshIdeas()
    } catch (e) {
      setError(e)
    }
  }, [])

  return { ideas, error, refresh, addIdea, deleteIdea }
}
