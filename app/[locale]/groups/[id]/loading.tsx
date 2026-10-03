import { Skeleton } from "@/components/ui/skeleton";
import { Panel } from "@/components/plasma";

// Форма повторяет реальную страницу (app/groups/[id]/page.tsx) — держи их в
// синхроне: поменялась вёрстка там, поменяй и здесь. Не знаем заранее,
// владелец ли юзер (это приходит вместе с данными), поэтому показываем
// усреднённый вид без специфичных для владельца блоков.
export default function GroupLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-4 w-64" />

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        <Panel className="flex flex-col p-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="glass-row justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </Panel>
      </div>

      <div className="mt-8">
        <Skeleton className="mb-4 h-4 w-32" />
        <Panel className="flex flex-col p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-row">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
