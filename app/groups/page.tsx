import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GroupsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  
  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, description")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Мои группы</h1>
        <Link
          href="/groups/new"
          className="rounded-full bg-[#4F9EFA] px-5 py-2.5 text-sm font-semibold text-[#0f1013] transition-colors hover:bg-[#4F9EFA]/90"
        >
          + Создать группу
        </Link>
      </div>

      {!groups?.length ? (
        <p className="text-white/50">
          Пока нет групп. Создай первую, чтобы начать организовывать покатушки.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <div className="h-11 w-11 shrink-0 rounded-full bg-[#4F9EFA]" />
              <div>
                <p className="font-semibold text-white">{group.name}</p>
                {group.description && (
                  <p className="text-sm text-white/50">{group.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}