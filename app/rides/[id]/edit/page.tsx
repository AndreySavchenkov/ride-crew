import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import { redirect, notFound } from "next/navigation";
import { updateRide } from "@/app/rides/actions";
import { GpxUploadField } from "@/components/gpx-upload-field";

export default async function EditRidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/rides/${id}/edit`);

  const supabase = await createClient();

  const { data: ride } = await supabase
    .from("rides")
    .select(
      "id, group_id, created_by, title, description, starts_at, location, route_url, route_points, distance_km, elevation_gain_m"
    )
    .eq("id", id)
    .single();

  if (!ride) notFound();
  if (ride.created_by !== user.id) {
    redirect(`/rides/${id}`);
  }

  const startsAtLocal = new Date(ride.starts_at).toISOString().slice(0, 16);

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl text-foreground">Редактировать покатушку</h1>

      <form action={updateRide} className="flex flex-col gap-5">
        <input type="hidden" name="ride_id" value={ride.id} />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            Название
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={ride.title}
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="starts_at"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            Дата и время
          </label>
          <input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            required
            defaultValue={startsAtLocal}
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="location"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            Место старта (необязательно)
          </label>
          <input
            id="location"
            name="location"
            defaultValue={ride.location ?? ""}
            placeholder="Парковка у Zielonka"
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="route_url"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            Ссылка на Strava/Komoot (необязательно)
          </label>
          <input
            id="route_url"
            name="route_url"
            type="url"
            defaultValue={ride.route_url ?? ""}
            placeholder="https://www.strava.com/routes/..."
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <GpxUploadField
          initialPoints={(ride.route_points as [number, number][] | null) ?? []}
          initialDistanceKm={ride.distance_km}
          initialElevationGainM={ride.elevation_gain_m}
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            Описание (необязательно)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={ride.description ?? ""}
            placeholder="Темп спокойный, ждём отстающих"
            className="resize-none border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
