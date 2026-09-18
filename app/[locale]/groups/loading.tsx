import { Skeleton } from "@/components/ui/skeleton";

// Форма повторяет реальную страницу (app/groups/page.tsx) — держи их в
// синхроне: поменялась вёрстка карточки группы там, поменяй и здесь.
export default function GroupsLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-3">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-2 border-border bg-card p-4"
          >
            <Skeleton className="size-11 shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-56" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
