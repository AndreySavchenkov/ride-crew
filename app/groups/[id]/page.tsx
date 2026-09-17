import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {CopyInviteCode} from "./copyInviteCode"
import { LeaveGroupButton } from "@/components/leave-group-button";
import { RemoveMemberButton } from "@/components/remove-member-button";
import { getViewerTimezone } from "@/utils/get-viewer-timezone";

type MemberRow = {
  role: string;
  profiles: { id: string; full_name: string; avatar_url: string | null } | null;
};

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/groups/${id}`);

  const supabase = await createClient();

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, description, invite_code, created_by")
    .eq("id", id)
    .single();

  if (!group) notFound();

  const { data: members } = await supabase
    .from("group_members")
    .select("role, profiles(id, full_name, avatar_url)")
    .eq("group_id", id)
    .returns<MemberRow[]>();

  const nowIso = new Date().toISOString();

  const { data: upcomingRides } = await supabase
    .from("rides")
    .select("id, title, starts_at, distance_km, created_at, created_by")
    .eq("group_id", id)
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true });

  // "Новое" — просто последние NEW_RIDE_WINDOW_MS от чужого создателя, без
  // отдельной таблицы "прочитано/не прочитано": бейдж сам исчезнет через
  // пару дней, ничего дополнительно отслеживать не нужно.
  const NEW_RIDE_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
  const isNewRide = (ride: { created_at: string; created_by: string }) =>
    ride.created_by !== user.id &&
    Date.now() - new Date(ride.created_at).getTime() < NEW_RIDE_WINDOW_MS;

  const { data: pastRides } = await supabase
    .from("rides")
    .select("id, title, starts_at, distance_km")
    .eq("group_id", id)
    .lt("starts_at", nowIso)
    .order("starts_at", { ascending: false });

  const viewerTimezone = await getViewerTimezone();
  // См. комментарий про часовой пояс зрителя в app/rides/[id]/page.tsx.
  const rideDateFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: viewerTimezone,
  });

  const isOwner = group.created_by === user.id;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl text-foreground">{group.name}</h1>
        {!isOwner && <LeaveGroupButton groupId={group.id} />}
      </div>
      {group.description && (
        <p className="mt-2 text-muted-foreground">{group.description}</p>
      )}

      {isOwner && (
        <div className="mt-6 border-2 border-border bg-card p-4">
          <p className="mb-2 font-label text-xs uppercase text-muted-foreground">
            Код приглашения
          </p>
          <CopyInviteCode code={group.invite_code} />
        </div>
      )}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-label text-xs uppercase text-muted-foreground">
            Ближайшие покатушки
          </p>
          <Link
            href={`/groups/${id}/rides/new`}
            className="font-label text-xs uppercase text-primary hover:underline"
          >
            + Создать покатушку
          </Link>
        </div>

        {!upcomingRides?.length ? (
          <p className="text-sm text-muted-foreground">
            Пока ничего не запланировано.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingRides.map((ride) => (
              <Link
                key={ride.id}
                href={`/rides/${ride.id}`}
                className="flex items-center justify-between border-2 border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-2 text-foreground">
                  {ride.title}
                  {isNewRide(ride) && (
                    <span className="border border-primary/40 bg-primary/15 px-2 py-0.5 font-label text-[0.65rem] uppercase text-primary">
                      Новое
                    </span>
                  )}
                </span>
                <span className="font-label text-xs uppercase text-muted-foreground">
                  {rideDateFormatter.format(new Date(ride.starts_at))}
                  {ride.distance_km && ` · ${ride.distance_km} км`}
                </span>
              </Link>
            ))}
          </div>
        )}

        {pastRides && pastRides.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer font-label text-xs uppercase text-muted-foreground hover:text-primary">
              Архив ({pastRides.length})
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              {pastRides.map((ride) => (
                <Link
                  key={ride.id}
                  href={`/rides/${ride.id}`}
                  className="flex items-center justify-between border-2 border-border bg-card p-4 text-muted-foreground transition-colors hover:border-primary"
                >
                  <span>{ride.title}</span>
                  <span className="font-label text-xs uppercase">
                    {rideDateFormatter.format(new Date(ride.starts_at))}
                  </span>
                </Link>
              ))}
            </div>
          </details>
        )}
      </div>

      <div className="mt-8">
        <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
          Участники ({members?.length ?? 0})
        </p>
        <div className="flex flex-col gap-3">
          {members?.map((m) =>
            m.profiles ? (
              <div
                key={m.profiles.id}
                className="flex items-center gap-3 border-2 border-border bg-card p-3"
              >
                <div className="size-9 shrink-0 overflow-hidden bg-primary">
                  {m.profiles.avatar_url && (
                    <img
                      src={m.profiles.avatar_url}
                      alt={m.profiles.full_name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="text-foreground">{m.profiles.full_name}</span>
                {m.role === "owner" ? (
                  <span className="ml-auto border border-primary/40 bg-primary/15 px-2.5 py-0.5 font-label text-xs uppercase text-primary">
                    Владелец
                  </span>
                ) : (
                  isOwner && (
                    <RemoveMemberButton
                      groupId={group.id}
                      userId={m.profiles.id}
                      memberName={m.profiles.full_name}
                    />
                  )
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}