import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import { redirect, notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { updateRide } from "@/app/rides/actions";
import { GpxUploadField } from "@/components/gpx-upload-field";
import { DateTimeLocalField } from "@/components/datetime-local-field";
import { LiquidButton, Panel } from "@/components/plasma";

export default async function EditRidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const locale = await getLocale();
  if (!user) redirect(`/${locale}/login?next=/rides/${id}/edit`);

  const t = await getTranslations("EditRide");
  const f = await getTranslations("RideForm");
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
    redirect(`/${locale}/rides/${id}`);
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl text-foreground">{t("title")}</h1>

      <form action={updateRide} className="flex flex-col gap-6">
        <Panel className="flex flex-col gap-5 p-5 sm:p-6">
          <input type="hidden" name="ride_id" value={ride.id} />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="font-label text-xs uppercase text-muted-foreground"
            >
              {f("titleLabel")}
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={ride.title}
              className="glass-field"
            />
          </div>

          <DateTimeLocalField label={f("dateTimeLabel")} defaultValueIso={ride.starts_at} />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="location"
              className="font-label text-xs uppercase text-muted-foreground"
            >
              {f("locationLabel")}
            </label>
            <input
              id="location"
              name="location"
              defaultValue={ride.location ?? ""}
              placeholder={f("locationPlaceholder")}
              className="glass-field"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="route_url"
              className="font-label text-xs uppercase text-muted-foreground"
            >
              {f("routeUrlLabel")}
            </label>
            <input
              id="route_url"
              name="route_url"
              type="url"
              defaultValue={ride.route_url ?? ""}
              placeholder={f("routeUrlPlaceholder")}
              className="glass-field"
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
              {f("descriptionLabel")}
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={ride.description ?? ""}
              placeholder={f("descriptionPlaceholder")}
              className="glass-field resize-none"
            />
          </div>
        </Panel>

        <LiquidButton type="submit">{t("submit")}</LiquidButton>
      </form>
    </div>
  );
}
