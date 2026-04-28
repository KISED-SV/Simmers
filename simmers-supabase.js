// simmers-supabase.js
// 메모장으로 열어서 YOUR_SUPABASE_URL과 YOUR_SUPABASE_KEY를 실제 값으로 교체하세요

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_KEY = 'YOUR_SUPABASE_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 현재 로그인한 유저 가져오기
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 로그인 체크 — 로그인 안 됐으면 auth 페이지로 이동
export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    location.href = 'simmers-auth.html'
    return null
  }
  return user
}
