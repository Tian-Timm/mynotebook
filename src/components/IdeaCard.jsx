import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IdeaCard({ idea, onClick, className = '' }) {
  const hasTitle = !!(idea && idea.title)
  return (
    <Card className={`hover:bg-zinc-800 transition cursor-pointer ${className}`} onClick={onClick}>
      {hasTitle ? (
        <CardHeader>
          <CardTitle className="text-zinc-200">{idea.title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={hasTitle ? 'pt-0' : 'p-6'}>
        <div className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-300 line-clamp-5">
          {idea.content}
        </div>
      </CardContent>
    </Card>
  )
}
