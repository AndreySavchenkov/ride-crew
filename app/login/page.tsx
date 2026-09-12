import { getUser } from "@/utils/supabase/getUser";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/signInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Same-origin-only guard, mirrored from the callback route.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : undefined;

  const user = await getUser();
  if (user) redirect(safeNext ?? "/groups");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-widest text-primary">
        Ride Crew
      </p>
      <h1 className="text-2xl text-foreground">Войди, чтобы продолжить</h1>
      <p className="text-muted-foreground">
        Нужно войти через Google, чтобы видеть группы и покатушки.
      </p>
      <SignInButton next={safeNext} />
    </div>
  );
}
