export function ProductCardSkeleton() {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-4">
        <div className="h-4 bg-white/8 rounded-lg w-3/4 mb-2" />
        <div className="h-3 bg-white/5 rounded-lg w-full mb-1" />
        <div className="h-3 bg-white/5 rounded-lg w-2/3 mb-4" />
        <div className="h-5 bg-white/8 rounded-lg w-1/2 mb-4" />
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-white/5 rounded-xl" />
          <div className="flex-1 h-9 bg-white/8 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="h-4 bg-white/8 rounded-lg w-32 mb-8" />
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 h-72 bg-white/5 rounded-2xl" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-8 bg-white/8 rounded-lg w-2/3" />
          <div className="h-4 bg-white/5 rounded-lg w-full" />
          <div className="h-4 bg-white/5 rounded-lg w-3/4" />
          <div className="h-10 bg-white/8 rounded-lg w-1/3 mt-2" />
          <div className="h-12 bg-white/5 rounded-xl mt-2" />
          <div className="flex gap-3 mt-4">
            <div className="flex-1 h-12 bg-white/5 rounded-xl" />
            <div className="flex-1 h-12 bg-white/8 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div>
          <div className="h-3 bg-white/5 rounded w-24 mb-2" />
          <div className="h-5 bg-white/8 rounded w-40" />
        </div>
        <div className="h-6 bg-white/8 rounded-full w-20" />
      </div>
      <div className="bg-white/2 rounded-xl p-3 mb-4 flex flex-col gap-2">
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
      </div>
      <div className="border-t border-white/8 pt-4 flex justify-between">
        <div className="h-4 bg-white/5 rounded w-32" />
        <div className="h-5 bg-white/8 rounded w-24" />
      </div>
    </div>
  )
}