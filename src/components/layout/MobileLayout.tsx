import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import IdeaCard from '@/components/IdeaCard.jsx'
import { Button } from '@/components/ui/button'

type Idea = { id: string; content: string; created_at?: string }

function shuffle<T>(input: T[]): T[] {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MobileLayout({
  ideas,
  onIdeaClick,
  onNewClick,
}: {
  ideas: Idea[]
  onIdeaClick: (idea: Idea) => void
  onNewClick: () => void
}) {
  const [shuffled, setShuffled] = useState<Idea[]>(() => shuffle(ideas))
  const [text] = useState('')

  useEffect(() => {
    setShuffled(shuffle(ideas))
  }, [ideas])

  

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="flex-1 h-0">
        <Swiper direction="vertical" loop={true} slidesPerView={1} className="h-full w-full">
          {(shuffled.length ? shuffled : [{ id: 'empty', content: '暂无点子' } as Idea]).map(
            (item) => (
              <SwiperSlide key={item.id}>
                <div
                  className={
                    `h-full w-full flex flex-col items-center p-8 overflow-y-auto ` +
                    ((item?.content?.length || 0) > 180 ? 'justify-start pt-8' : 'justify-center')
                  }
                >
                  <div className="w-full max-w-prose">
                    <IdeaCard idea={item} onClick={() => item.id !== 'empty' && onIdeaClick(item)} />
                  </div>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 z-50 flex items-center">
        <Button
          onClick={onNewClick}
          className="w-full mx-6 h-12 rounded-full bg-blue-600 text-white text-lg font-medium shadow hover:bg-blue-500 transition"
        >
          New Idea
        </Button>
      </div>
    </div>
  )
}
