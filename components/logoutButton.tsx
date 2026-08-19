import { signOut } from "@/app/auth/actions";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-full border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400/80 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1013]"
      >
        Выйти
      </button>
    </form>
  );
}