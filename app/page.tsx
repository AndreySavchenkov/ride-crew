import { LogoutButton } from '@/components/logoutButton'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {user ? (
        <>
          <p>Привет, {user.email}!</p>
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="h-16 w-16 rounded-full"
          />
          <LogoutButton/>
        </>
      ) : (
        <p>Не залогинен. <a href="/login" className="underline">Войти</a></p>
      )}
    </div>
  )
}