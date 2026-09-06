import { createGroup } from "@/app/groups/actions";

export default function NewGroupPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold color-red">Создать группу</h1>

      <form action={createGroup} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium ">
            Название
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Poznań MTB Crew"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 placeholder:text-white/30 focus:border-[#4F9EFA] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium ">
            Описание (необязательно)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Компания для покатушек по трейлам Zielonka"
            className="resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5  placeholder:text-white/30 focus:border-[#4F9EFA] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-full bg-[#4F9EFA] px-6 py-3 text-sm font-semibold text-[#0f1013] transition-colors hover:bg-[#4F9EFA]/90"
        >
          Создать группу
        </button>
      </form>
    </div>
  );
}