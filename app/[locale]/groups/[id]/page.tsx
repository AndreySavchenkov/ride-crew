import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import { redirect, notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CopyInviteCode } from "@/app/groups/[id]/copyInviteCode";
import { LeaveGroupButton } from "@/components/leave-group-button";
import { RemoveMemberButton } from "@/components/remove-member-button";
import { DeleteGroupButton } from "@/components/delete-group-button";
import { getViewerTimezone } from "@/utils/get-viewer-timezone";
import { toIntlLocale } from "@/utils/intl-locale";
import { LiquidLink, Panel } from "@/components/plasma";

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
  const locale = await getLocale();
  if (!user) redirect(`/${locale}/login?next=/groups/${id}`);

  const t = await getTranslations("GroupDetail");
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
  // См. комментарий про часовой пояс зрителя в app/[locale]/rides/[id]/page.tsx.
  const rideDateFormatter = new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: viewerTimezone,
  });

  const isOwner = group.created_by === user.id;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-6">
        <h1 className="text-2xl text-foreground">{group.name}</h1>
        {isOwner ? (
          <DeleteGroupButton groupId={group.id} />
        ) : (
          <LeaveGroupButton groupId={group.id} />
        )}
      </div>
      {group.description && (
        <p className="mt-2 text-muted-foreground">{group.description}</p>
      )}

      {isOwner && (
        <Panel className="mt-8 p-4">
          <p className="mb-3 font-label text-xs uppercase text-muted-foreground">
            {t("inviteCode")}
          </p>
          <CopyInviteCode code={group.invite_code} />
        </Panel>
      )}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-6">
          <p className="font-label text-xs uppercase text-muted-foreground">
            {t("upcomingRides")}
          </p>
          <LiquidLink href={`/groups/${id}/rides/new`} size="sm">
            {t("createRide")}
          </LiquidLink>
        </div>

        {!upcomingRides?.length ? (
          <p className="text-sm text-muted-foreground">{t("nothingPlanned")}</p>
        ) : (
          <Panel className="flex flex-col p-2">
            {upcomingRides.map((ride) => (
              <Link
                key={ride.id}
                href={`/rides/${ride.id}`}
                className="glass-row glass-row-link justify-between"
              >
                <span className="flex items-center gap-2 text-foreground">
                  {ride.title}
                  {isNewRide(ride) && (
                    <span className="glass-badge">{t("newBadge")}</span>
                  )}
                </span>
                <span className="text-right font-label text-xs uppercase text-muted-foreground">
                  {rideDateFormatter.format(new Date(ride.starts_at))}
                  {ride.distance_km && ` · ${t("distanceKm", { value: ride.distance_km })}`}
                </span>
              </Link>
            ))}
          </Panel>
        )}

        {pastRides && pastRides.length > 0 && (
          <Panel className="mt-6 p-2">
            <details>
              <summary className="cursor-pointer rounded-xl p-3 font-label text-xs uppercase text-muted-foreground hover:text-primary">
                {t("archive", { count: pastRides.length })}
              </summary>
              <div className="flex flex-col">
                {pastRides.map((ride) => (
                  <Link
                    key={ride.id}
                    href={`/rides/${ride.id}`}
                    className="glass-row glass-row-link justify-between text-muted-foreground"
                  >
                    <span>{ride.title}</span>
                    <span className="font-label text-xs uppercase">
                      {rideDateFormatter.format(new Date(ride.starts_at))}
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          </Panel>
        )}
      </div>

      <div className="mt-8">
        <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
          {t("members", { count: members?.length ?? 0 })}
        </p>
        <Panel className="flex flex-col p-2">
          {members?.map((m) =>
            m.profiles ? (
              <div key={m.profiles.id} className="glass-row">
                <div className="size-9 shrink-0 overflow-hidden rounded-full bg-primary">
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
                  <span className="glass-badge ml-auto">{t("owner")}</span>
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
        </Panel>
      </div>
    </div>
  );
}
