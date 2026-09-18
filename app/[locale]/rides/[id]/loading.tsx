import { Skeleton } from "@/components/ui/skeleton";

// Форма повторяет реальную страницу (app/rides/[id]/page.tsx) — держи их в
// синхроне: поменялась вёрстка там, поменяй и здесь.
export default function RideLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Skeleton className="h-4 w-24" />

      <div className="mt-4 flex items-start justify-between gap-4">
        <Skeleton className="h-8 w-56" />
      </div>
      <Skeleton className="mt-1 h-4 w-48" />

      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />

      <div className="mt-6 h-56 w-full border-2 border-border">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="mt-8">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {["Идут", "Под вопросом", "Не идут"].map((title) => (
        <div key={title} className="mt-8">
          <Skeleton className="mb-4 h-4 w-28" />
          <div className="flex items-center gap-3 border-2 border-border bg-card p-3">
            <Skeleton className="size-9 shrink-0" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
