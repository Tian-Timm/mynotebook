import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

if (!url || !key) {
  throw new Error('Missing Supabase configuration')
}

// 👇 核心修改在这里：添加 global headers
export const supabase = createClient(url, key, {
  global: {
    headers: {
      // 这是你的私人暗号，随便写一串复杂的，别告诉别人
      'x-my-secret-code': 'Hyt-2026-Super-Secret-Key' 
    }
  }
})