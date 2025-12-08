import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: { title: string; content: string }) => void
}

export default function CreateIdeaDialog({ open, onOpenChange, onSave }: Props) {
  const [content, setContent] = useState('')

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleSave = () => {
    const c = content.trim()
    if (!c) return
    onSave({ title: '', content: c })
    setContent('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Capture Idea</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="min-h-40"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-500" onClick={handleSave}>Save Idea</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
