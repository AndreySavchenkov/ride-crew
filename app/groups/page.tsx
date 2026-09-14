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

  // Сколько новых покатушек (от чужих создателей, за последние 3 дня) есть в
  // каждой группе — без этого бейдж "Новое" видит только тот, кто уже открыл
  // группу, а смысл уведомления как раз в обратном.
  const NEW_RIDE_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
  const newRidesCountByGroup = new Map<string, number>();
  if (groups?.length) {
    const { data: recentRides } = await supabase
      .from("rides")
      .select("group_id")
      .in("group_id", groups.map((g) => g.id))
      .neq("created_by", user.id)
      .gte("created_at", new Date(Date.now() - NEW_RIDE_WINDOW_MS).toISOString());

    for (const ride of recentRides ?? []) {
      newRidesCountByGroup.set(
        ride.group_id,
        (newRidesCountByGroup.get(ride.group_id) ?? 0) + 1
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-3">
        <h1 className="text-2xl text-foreground">Мои группы</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/groups/join"
            className="border-2 border-border bg-card px-5 py-2.5 font-label text-sm uppercase text-foreground transition-colors hover:border-primary"
          >
            Вступить по коду
          </Link>
          <Link
            href="/groups/new"
            className="border-2 border-primary bg-primary px-5 py-2.5 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
          >
            + Создать группу
          </Link>
        </div>
      </div>

      {!groups?.length ? (
        <p className="text-muted-foreground">
          Пока нет групп. Создай свою или вступи в существующую по коду
          приглашения.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => {
            const newRidesCount = newRidesCountByGroup.get(group.id) ?? 0;
            return (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="flex items-center gap-4 border-2 border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <div className="size-11 shrink-0 bg-primary" />
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-foreground">
                    {group.name}
                    {newRidesCount > 0 && (
                      <span className="border border-primary/40 bg-primary/15 px-2 py-0.5 font-label text-[0.65rem] uppercase text-primary">
                        {newRidesCount} новых
                      </span>
                    )}
                  </p>
                  {group.description && (
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
