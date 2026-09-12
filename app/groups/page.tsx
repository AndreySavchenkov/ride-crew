import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import Link from "next/link";
import { redirect } from "next/navigation";

type GroupRow = { id: string; name: string; description: string | null };

export default async function GroupsPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/groups");

  const supabase = await createClient();

  // Inner join on group_members scopes this to groups the user actually
  // belongs to — without it every group in the database was listed here.
  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, description, group_members!inner(user_id)")
    .eq("group_members.user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<GroupRow[]>();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl text-foreground">Мои группы</h1>
        <Link
          href="/groups/new"
          className="border-2 border-primary bg-primary px-5 py-2.5 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          + Создать группу
        </Link>
      </div>

      {!groups?.length ? (
        <p className="text-muted-foreground">
          Пока нет групп. Создай первую, чтобы начать организовывать покатушки.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="flex items-center gap-4 border-2 border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <div className="size-11 shrink-0 bg-primary" />
              <div>
                <p className="text-foreground">{group.name}</p>
                {group.description && (
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
