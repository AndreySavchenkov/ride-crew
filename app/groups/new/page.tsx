import { createGroup } from "@/app/groups/actions";
import { getUser } from "@/utils/supabase/getUser";
import { redirect } from "next/navigation";

export default async function NewGroupPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/groups/new");

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl text-foreground">Создать группу</h1>

      <form action={createGroup} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            Название
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Poznań MTB Crew"
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

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
            placeholder="Компания для покатушек по трейлам Zielonka"
            className="resize-none border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          Создать группу
        </button>
      </form>
    </div>
  );
}
