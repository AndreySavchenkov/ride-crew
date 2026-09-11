import { createRide } from "@/app/rides/actions";
import { GpxUploadField } from "@/components/gpx-upload-field";

export default async function NewRidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl text-foreground">Создать покатушку</h1>

      <form action={createRide} className="flex flex-col gap-5">
        <input type="hidden" name="group_id" value={id} />

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
            placeholder="Вечерняя покатушка по трейлам"
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
            placeholder="https://www.strava.com/routes/..."
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <GpxUploadField />

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
            placeholder="Темп спокойный, ждём отстающих"
            className="resize-none border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          Создать покатушку
        </button>
      </form>
    </div>
  );
}
