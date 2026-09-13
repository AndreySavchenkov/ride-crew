import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { RouteMap } from "@/components/route-map";
import { RideRsvpButtons } from "@/components/ride-rsvp-buttons";
import { RideOwnerActions } from "@/components/ride-owner-actions";

type RsvpRow = {
  status: "going" | "maybe" | "not_going";
  user_id: string;
  profiles: { id: string; full_name: string; avatar_url: string | null } | null;
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "short",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function RidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/rides/${id}`);

  const supabase = await createClient();

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

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl text-foreground">{ride.title}</h1>
        {ride.created_by === user.id && (
          <RideOwnerActions rideId={ride.id} groupId={ride.group_id} />
        )}
      </div>
      <p className="mt-1 text-muted-foreground">
        {dateFormatter.format(new Date(ride.starts_at))}
        {ride.location && ` · ${ride.location}`}
      </p>

      {ride.description && (
        <p className="mt-4 text-foreground">{ride.description}</p>
      )}

      {(ride.distance_km || ride.elevation_gain_m) && (
        <div className="mt-4 flex gap-4 font-label text-xs uppercase text-muted-foreground">
          {ride.distance_km && <span>{ride.distance_km} км</span>}
          {ride.elevation_gain_m && <span>+{ride.elevation_gain_m} м</span>}
        </div>
      )}

      {ride.route_points && (
        <div className="mt-6">
          <RouteMap points={ride.route_points as [number, number][]} />
        </div>
      )}

      {ride.route_url && (
        <a
          href={ride.route_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block border-2 border-border bg-card px-4 py-2 font-label text-xs uppercase text-foreground transition-colors hover:border-primary"
        >
          Открыть маршрут ↗
        </a>
      )}

      <div className="mt-8">
        <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
          Твой ответ
        </p>
        <RideRsvpButtons rideId={ride.id} currentStatus={myRsvp?.status ?? null} />
      </div>

      <RsvpRoster title="Идут" attendees={grouped.going} />
      <RsvpRoster title="Под вопросом" attendees={grouped.maybe} />
      <RsvpRoster title="Не идут" attendees={grouped.not_going} />
    </div>
  );
}

function RsvpRoster({ title, attendees }: { title: string; attendees: RsvpRow[] }) {
  return (
    <div className="mt-8">
      <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
        {title} ({attendees.length})
      </p>
      <div className="flex flex-col gap-3">
        {attendees.map((r) =>
          r.profiles ? (
            <div
              key={r.profiles.id}
              className="flex items-center gap-3 border-2 border-border bg-card p-3"
            >
              <div className="size-9 shrink-0 overflow-hidden bg-primary">
                {r.profiles.avatar_url && (
                  <img
                    src={r.profiles.avatar_url}
                    alt={r.profiles.full_name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <span className="text-foreground">{r.profiles.full_name}</span>
            </div>
          ) : null
        )}
        {attendees.length === 0 && (
          <p className="text-sm text-muted-foreground">Пока никто не отметился.</p>
        )}
      </div>
    </div>
  );
}
