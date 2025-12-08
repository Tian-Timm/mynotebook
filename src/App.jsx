import { useEffect, useState } from 'react'
import Mobile from './components/Mobile.jsx'
import Desktop from './components/Desktop.jsx'

export default function App() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth < 768
  })
  const [selectedIdea, setSelectedIdea] = useState(null)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    if (mql.addEventListener) mql.addEventListener('change', handler)
    else mql.addListener(handler)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler)
      else mql.removeListener(handler)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
      {isMobile ? (
        <Mobile setSelectedIdea={setSelectedIdea} />
      ) : (
        <Desktop setSelectedIdea={setSelectedIdea} />
      )}
      {selectedIdea && (
        <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </div>
  )
}

function IdeaModal({ idea, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800/50 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-3 py-1 rounded-md bg-black border border-zinc-700/60 text-zinc-100 hover:border-zinc-500 transition"
        >
          Close
        </button>
        <div className="whitespace-pre-wrap text-lg text-zinc-200">
          {idea?.content}
        </div>
      </div>
    </div>
  )
}
