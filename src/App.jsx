import { useState } from 'react'
import MobileLayout from '@/components/layout/MobileLayout'
import DesktopLayout from '@/components/layout/DesktopLayout'
import { useMobile } from '@/hooks/use-mobile'
import { useIdeas } from './hooks/useIdeas'
import CreateIdeaDialog from '@/components/CreateIdeaDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function App() {
  const isMobile = useMobile()
  const { ideas, addIdea, deleteIdea } = useIdeas()
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [localCreated, setLocalCreated] = useState([])

  const viewIdeas = [...localCreated, ...ideas]

  const handleSaveIdea = ({ content }) => {
    const now = new Date().toISOString()
    const newIdea = { id: Date.now(), created_at: now, title: '', content }
    setLocalCreated((prev) => [newIdea, ...prev])
    setIsCreateOpen(false)
  }

  const handleDeleteIdea = async (id) => {
    if (typeof id === 'number') {
      setLocalCreated((prev) => prev.filter((i) => i.id !== id))
      return
    }
    await deleteIdea(id)
    setLocalCreated((prev) => prev.filter((i) => String(i.id) !== String(id)))
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
      {isMobile ? (
        <MobileLayout ideas={viewIdeas} onIdeaClick={setSelectedIdea} onNewClick={() => setIsCreateOpen(true)} />
      ) : (
        <DesktopLayout ideas={viewIdeas} onIdeaClick={setSelectedIdea} addIdea={addIdea} deleteIdea={handleDeleteIdea} />
      )}

      <CreateIdeaDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSave={handleSaveIdea} />
      <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
    </div>
  )
}

function IdeaModal({ idea, onClose }) {
  const open = !!idea
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Idea</DialogTitle>
          <DialogDescription>Full content</DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-wrap text-lg text-zinc-200">
          {idea?.content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
