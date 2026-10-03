import { Skeleton } from "@/components/ui/skeleton";
import { Panel, type Tint } from "@/components/plasma";

const ROSTER_TINTS: Tint[] = ["going", "maybe", "notGoing"];

// Форма повторяет реальную страницу (app/rides/[id]/page.tsx) — держи их в
// синхроне: поменялась вёрстка там, поменяй и здесь.
export default function RideLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Skeleton className="h-4 w-24" />

      <div className="mt-4 flex items-start justify-between gap-6">
        <Skeleton className="h-8 w-56" />
      </div>

      <Panel className="mt-6 flex flex-col gap-4 p-5">
        <Skeleton className="h-4 w-48" />
        <div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
      </Panel>

      <div className="mt-8">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="flex flex-wrap gap-6">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      {ROSTER_TINTS.map((tint) => (
        <div key={tint} className="mt-8">
          <Skeleton className="mb-4 h-4 w-28" />
          <Panel tint={tint} className="flex flex-col p-2">
            <div className="glass-row">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Panel>
        </div>
      ))}

      <div className="mt-8">
        <Skeleton className="mb-4 h-4 w-32" />
        <Panel className="flex flex-col gap-3 p-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="glass-row items-start">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-4 w-full" />
              </div>
            </div>
          ))}
          <div className="p-1">
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </Panel>
      </div>
    </div>
  );
}
