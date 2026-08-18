import { signOut } from '@/app/auth/actions'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700"
      >
        Выйти
      </button>
    </form>
  )
}