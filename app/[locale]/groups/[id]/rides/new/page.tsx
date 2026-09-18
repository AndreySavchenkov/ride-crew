import { createRide } from "@/app/rides/actions";
import { GpxUploadField } from "@/components/gpx-upload-field";
import { DateTimeLocalField } from "@/components/datetime-local-field";
import { getUser } from "@/utils/supabase/getUser";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function NewRidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const locale = await getLocale();
  if (!user) redirect(`/${locale}/login?next=/groups/${id}/rides/new`);

  const t = await getTranslations("NewRide");
  const f = await getTranslations("RideForm");

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl text-foreground">{t("title")}</h1>

      <form action={createRide} className="flex flex-col gap-5">
        <input type="hidden" name="group_id" value={id} />

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
            placeholder={f("titlePlaceholder")}
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <DateTimeLocalField label={f("dateTimeLabel")} />

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
            placeholder={f("locationPlaceholder")}
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
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
            placeholder={f("routeUrlPlaceholder")}
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <GpxUploadField />

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
            placeholder={f("descriptionPlaceholder")}
            className="resize-none border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 cursor-pointer border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
