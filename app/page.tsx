import { getUser } from "@/utils/supabase/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();

  // if (user) {
  //   redirect("/groups");
  // }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-widest text-primary">
        Ride Crew
      </p>
      <h1 className="text-3xl leading-relaxed text-foreground">
        Организуй групповые покатушки
      </h1>
      <p className="max-w-md text-muted-foreground">
        Создавай группы, зови друзей, планируйте покатушки вместе — без хаоса в
        чатах и таблицах.
      </p>
      <Link
        href="/groups/new"
        className="border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
      >
        Начать
      </Link>
    </div>
  );
}
