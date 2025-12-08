import { useMemo, useRef, useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import IdeaCard from '@/components/IdeaCard.jsx'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Idea = { id: string; content: string; created_at?: string }

export default function DesktopLayout({
  ideas,
  onIdeaClick,
  addIdea,
  deleteIdea,
}: {
  ideas: Idea[]
  onIdeaClick: (idea: Idea) => void
  addIdea: (content: string) => Promise<any>
  deleteIdea: (id: string | number) => Promise<any>
}) {
  const [text, setText] = useState('')
  const [toast, setToast] = useState('')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const sorted = useMemo(() => {
    return [...ideas].sort((a, b) => {
      const ta = new Date(a.created_at || '').getTime()
      const tb = new Date(b.created_at || '').getTime()
      return tb - ta
    })
  }, [ideas])

  const showToast = (msg: string) => {
    setToast(msg)
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setToast(''), 2000)
  }

  const submit = async () => {
    const v = text.trim()
    if (!v) return
    await addIdea(v)
    setText('')
    showToast('Saved')
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Write your idea here... (Ctrl + Enter to save)"
            className="h-40"
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={submit} className="bg-black border border-zinc-700/60 text-zinc-100 hover:border-zinc-500">
              Save
            </Button>
          </div>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {(sorted.length ? sorted : [{ id: 'empty', content: 'No ideas yet' } as Idea]).map((item) => (
            <div key={item.id} className="relative">
              {item.id !== 'empty' && (
                <button
                  aria-label="delete"
                  onClick={async (e) => {
                    e.stopPropagation()
                    if (confirm('Delete this idea?')) {
                      await deleteIdea(item.id)
                      showToast('Deleted')
                    }
                  }}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition-colors z-10"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <IdeaCard idea={item} onClick={() => item.id !== 'empty' && onIdeaClick(item)} />
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black border border-zinc-700/60 text-zinc-100 px-4 py-2 rounded-full shadow-lg shadow-zinc-900/40">
          {toast}
        </div>
      )}
    </div>
  )
}
