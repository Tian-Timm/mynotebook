import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { X, Check } from 'lucide-react'
import { useIdeas } from '../hooks/useIdeas'
import IdeaCard from './IdeaCard.jsx'

function shuffle(input) {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Mobile({ setSelectedIdea }) {
  const { ideas, addIdea } = useIdeas()
  const [shuffled, setShuffled] = useState(() => shuffle(ideas))
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    setShuffled(shuffle(ideas))
  }, [ideas])

  const handleSave = async () => {
    const v = text.trim()
    if (!v) return
    await addIdea(v)
    setText('')
    setOpen(false)
  }

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="h-[calc(100vh-5rem)]">
        <Swiper direction="vertical" slidesPerView={1} className="h-full">
          {(shuffled.length ? shuffled : [{ id: 'empty', content: '暂无点子' }]).map(
            (item) => (
              <SwiperSlide key={item.id}>
                <div
                  className={
                    `h-full w-full flex flex-col items-center p-8 overflow-y-auto ` +
                    ((item?.content?.length || 0) > 180 ? 'justify-start pt-8' : 'justify-center')
                  }
                >
                  <div className="w-full max-w-prose">
                    <IdeaCard idea={item} onClick={() => item.id !== 'empty' && setSelectedIdea(item)} />
                  </div>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 z-50 flex items-center">
        <button
          onClick={() => setOpen(true)}
          className="w-full mx-6 h-12 rounded-full bg-blue-600 text-white text-lg font-medium shadow hover:bg-blue-500 transition"
        >
          创建新点子
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex flex-col z-[60]">
          <div className="flex-1" />
          <div className="bg-zinc-950 rounded-t-2xl p-4 min-h-[50vh] border-t border-zinc-800/50">
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-full bg-black border border-zinc-700/60 text-zinc-100 flex items-center justify-center"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleSave}
                className="h-10 px-4 rounded-full bg-black border border-zinc-700/60 text-zinc-100 flex items-center gap-2 hover:border-zinc-500 transition"
              >
                <Check size={18} /> 保存
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="写下你的点子..."
              className="w-full h-[50vh] bg-zinc-900 border border-zinc-800/50 rounded-xl text-zinc-200 text-2xl outline-none resize-none p-4 focus:ring-1 focus:ring-zinc-700"
            />
          </div>
        </div>
      )}
    </div>
  )
}
