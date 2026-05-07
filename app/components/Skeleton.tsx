export function ProductCardSkeleton() {
  return (
    <div className="border rounded-2xl overflow-hidden animate-pulse bg-white border-black/8 dark:bg-white/4 dark:border-white/8">
      <div className="h-48 bg-black/5 dark:bg-white/5" />
      <div className="p-4">
        <div className="h-4 rounded-lg w-3/4 mb-2 bg-black/8 dark:bg-white/8" />
        <div className="h-3 rounded-lg w-full mb-1 bg-black/5 dark:bg-white/5" />
        <div className="h-3 rounded-lg w-2/3 mb-4 bg-black/5 dark:bg-white/5" />
        <div className="h-5 rounded-lg w-1/2 mb-4 bg-black/8 dark:bg-white/8" />
        <div className="flex gap-2">
          <div className="flex-1 h-9 rounded-xl bg-black/5 dark:bg-white/5" />
          <div className="flex-1 h-9 rounded-xl bg-black/8 dark:bg-white/8" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="h-4 rounded-lg w-32 mb-8 bg-black/8 dark:bg-white/8" />
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 h-72 rounded-2xl bg-black/5 dark:bg-white/5" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-8 rounded-lg w-2/3 bg-black/8 dark:bg-white/8" />
          <div className="h-4 rounded-lg w-full bg-black/5 dark:bg-white/5" />
          <div className="h-4 rounded-lg w-3/4 bg-black/5 dark:bg-white/5" />
          <div className="h-10 rounded-lg w-1/3 mt-2 bg-black/8 dark:bg-white/8" />
          <div className="h-12 rounded-xl mt-2 bg-black/5 dark:bg-white/5" />
          <div className="flex gap-3 mt-4">
            <div className="flex-1 h-12 rounded-xl bg-black/5 dark:bg-white/5" />
            <div className="flex-1 h-12 rounded-xl bg-black/8 dark:bg-white/8" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="border rounded-2xl p-6 animate-pulse bg-white border-black/8 dark:bg-white/4 dark:border-white/8">
      <div className="flex justify-between mb-4">
        <div>
          <div className="h-3 rounded w-24 mb-2 bg-black/5 dark:bg-white/5" />
          <div className="h-5 rounded w-40 bg-black/8 dark:bg-white/8" />
        </div>
        <div className="h-6 rounded-full w-20 bg-black/8 dark:bg-white/8" />
      </div>
      <div className="rounded-xl p-3 mb-4 flex flex-col gap-2 bg-black/2 dark:bg-white/2">
        <div className="h-4 rounded w-full bg-black/5 dark:bg-white/5" />
        <div className="h-4 rounded w-3/4 bg-black/5 dark:bg-white/5" />
      </div>
      <div className="border-t pt-4 flex justify-between border-black/8 dark:border-white/8">
        <div className="h-4 rounded w-32 bg-black/5 dark:bg-white/5" />
        <div className="h-5 rounded w-24 bg-black/8 dark:bg-white/8" />
      </div>
    </div>
  )
}