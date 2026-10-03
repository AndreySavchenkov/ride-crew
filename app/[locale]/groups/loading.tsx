import { Skeleton } from "@/components/ui/skeleton";
import { Panel } from "@/components/plasma";

// Форма повторяет реальную страницу (app/groups/page.tsx) — держи их в
// синхроне: поменялась вёрстка карточки группы там, поменяй и здесь.
export default function GroupsLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-9 w-36 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-full" />
        </div>
      </div>

      <Panel className="flex flex-col p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-row gap-4">
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-56" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
