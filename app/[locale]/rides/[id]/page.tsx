import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import { redirect, notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RouteMap } from "@/components/route-map";
import { RideRsvpButtons } from "@/components/ride-rsvp-buttons";
import { RideOwnerActions } from "@/components/ride-owner-actions";
import { RideCommentForm } from "@/components/ride-comment-form";
import { DeleteCommentButton } from "@/components/delete-comment-button";
import { getViewerTimezone } from "@/utils/get-viewer-timezone";
import { toIntlLocale } from "@/utils/intl-locale";
import { Panel, type Tint } from "@/components/plasma";

type RsvpRow = {
  status: "going" | "maybe" | "not_going";
  user_id: string;
  profiles: { id: string; full_name: string; avatar_url: string | null } | null;
};

type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: { id: string; full_name: string; avatar_url: string | null } | null;
};

export default async function RidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const locale = await getLocale();
  if (!user) redirect(`/${locale}/login?next=/rides/${id}`);

  const t = await getTranslations("RideDetail");
  const tc = await getTranslations("RideComments");
  const supabase = await createClient();
  const viewerTimezone = await getViewerTimezone();

  // Часовой пояс зрителя (см. TimezoneSync/getViewerTimezone) — без него
  // это форматирование считалось бы в поясе рантайма сервера (на Vercel —
  // всегда UTC), а не в реальном поясе того, кто смотрит на дату.
  const dateFormatter = new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: viewerTimezone,
  });

  const commentDateFormatter = new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: viewerTimezone,
  });

  const { data: ride } = await supabase
    .from("rides")
    .select(
      "id, group_id, created_by, title, description, starts_at, location, route_url, route_points, distance_km, elevation_gain_m, groups(name)"
    )
    .eq("id", id)
    .single();

  if (!ride) notFound();

  const { data: rsvps } = await supabase
    .from("ride_rsvps")
    .select("status, user_id, profiles(id, full_name, avatar_url)")
    .eq("ride_id", id)
    .returns<RsvpRow[]>();

  const { data: comments } = await supabase
    .from("ride_comments")
    .select("id, body, created_at, user_id, profiles(id, full_name, avatar_url)")
    .eq("ride_id", id)
    .order("created_at", { ascending: true })
    .returns<CommentRow[]>();

  const myRsvp = rsvps?.find((r) => r.user_id === user.id) ?? null;
  const groupName = (ride.groups as unknown as { name: string } | null)?.name;

  const grouped = {
    going: rsvps?.filter((r) => r.status === "going") ?? [],
    maybe: rsvps?.filter((r) => r.status === "maybe") ?? [],
    not_going: rsvps?.filter((r) => r.status === "not_going") ?? [],
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {groupName && (
        <Link
          href={`/groups/${ride.group_id}`}
          className="font-label text-xs uppercase text-muted-foreground hover:text-primary"
        >
          ← {groupName}
        </Link>
      )}

      <div className="mt-4 flex items-start justify-between gap-6">
        <h1 className="text-2xl text-foreground">{ride.title}</h1>
        {ride.created_by === user.id && (
          <RideOwnerActions rideId={ride.id} groupId={ride.group_id} />
        )}
      </div>

      <Panel className="mt-6 flex flex-col gap-4 p-5">
        <p className="text-muted-foreground">
          {dateFormatter.format(new Date(ride.starts_at))}
          {ride.location && ` · ${ride.location}`}
        </p>

        {ride.description && (
          <p className="text-foreground">{ride.description}</p>
        )}

        {(ride.distance_km || ride.elevation_gain_m) && (
          <div className="flex gap-4 font-label text-xs uppercase text-muted-foreground">
            {ride.distance_km && <span>{t("distanceKm", { value: ride.distance_km })}</span>}
            {ride.elevation_gain_m && (
              <span>{t("elevationM", { value: ride.elevation_gain_m })}</span>
            )}
          </div>
        )}

        {ride.route_points && (
          <RouteMap points={ride.route_points as [number, number][]} />
        )}

        {ride.route_url && (
          <a
            href={ride.route_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button self-start"
          >
            {t("openRoute")}
          </a>
        )}
      </Panel>

      <div className="mt-8">
        <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
          {t("yourResponse")}
        </p>
        <RideRsvpButtons rideId={ride.id} currentStatus={myRsvp?.status ?? null} />
      </div>

      <RsvpRoster title={t("going")} attendees={grouped.going} tint="going" nobodyYet={t("nobodyYet")} />
      <RsvpRoster title={t("maybe")} attendees={grouped.maybe} tint="maybe" nobodyYet={t("nobodyYet")} />
      <RsvpRoster title={t("notGoing")} attendees={grouped.not_going} tint="notGoing" nobodyYet={t("nobodyYet")} />

      <div className="mt-8">
        <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
          {tc("title", { count: comments?.length ?? 0 })}
        </p>

        <Panel className="flex flex-col gap-3 p-3">
          {comments?.map((c) =>
            c.profiles ? (
              <div key={c.id} className="glass-row items-start">
                <div className="size-9 shrink-0 overflow-hidden rounded-full bg-primary">
                  {c.profiles.avatar_url && (
                    <img
                      src={c.profiles.avatar_url}
                      alt={c.profiles.full_name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-foreground">{c.profiles.full_name}</span>
                    <span className="font-label text-[0.65rem] uppercase text-muted-foreground">
                      {commentDateFormatter.format(new Date(c.created_at))}
                    </span>
                  </div>
                  <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">{c.body}</p>
                  {c.user_id === user.id && (
                    <div className="mt-1">
                      <DeleteCommentButton commentId={c.id} rideId={ride.id} />
                    </div>
                  )}
                </div>
              </div>
            ) : null
          )}
          {!comments?.length && (
            <p className="px-3 pt-2 text-sm text-muted-foreground">{tc("empty")}</p>
          )}

          <div className="p-1">
            <RideCommentForm rideId={ride.id} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function RsvpRoster({
  title,
  attendees,
  tint,
  nobodyYet,
}: {
  title: string;
  attendees: RsvpRow[];
  tint: Tint;
  nobodyYet: string;
}) {
  return (
    <div className="mt-8">
      <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
        {title} ({attendees.length})
      </p>
      {attendees.length === 0 ? (
        <p className="text-sm text-muted-foreground">{nobodyYet}</p>
      ) : (
        <Panel tint={tint} className="flex flex-col p-2">
          {attendees.map((r) =>
            r.profiles ? (
              <div key={r.profiles.id} className="glass-row">
                <div className="size-9 shrink-0 overflow-hidden rounded-full bg-primary">
                  {r.profiles.avatar_url && (
                    <img
                      src={r.profiles.avatar_url}
                      alt={r.profiles.full_name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="text-foreground">{r.profiles.full_name}</span>
              </div>
            ) : null
          )}
        </Panel>
      )}
    </div>
  );
}
