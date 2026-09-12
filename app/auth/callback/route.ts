import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Only allow same-origin relative paths — never redirect off-site
  // (protects against an open redirect via a crafted `next` param).
  const destination = next?.startsWith('/') && !next.startsWith('//') ? next : '/'

  return NextResponse.redirect(`${origin}${destination}`)
}