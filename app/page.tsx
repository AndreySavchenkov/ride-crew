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
      <h1 className="text-4xl font-bold text-white">
        Организуй групповые покатушки
      </h1>
      <p className="max-w-md text-white/60">
        Создавай группы, зови друзей, планируйте покатушки вместе — без хаоса в
        чатах и таблицах.
      </p>
      <Link
        href="/groups/new"
        className="rounded-full bg-[#4F9EFA] px-6 py-3 text-sm font-semibold text-[#0f1013] transition-colors hover:bg-[#4F9EFA]/90"
      >
        Начать
      </Link>
    </div>
  );
}
