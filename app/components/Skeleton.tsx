interface SkeletonProps {
  isDark?: boolean;
}

export function ProductCardSkeleton({ isDark = true }: SkeletonProps) {
  const d = isDark
  return (
    <div className={`border rounded-2xl overflow-hidden animate-pulse ${d ? "bg-white/4 border-white/8" : "bg-white border-black/8"}`}>
      <div className={`h-48 ${d ? "bg-white/5" : "bg-black/5"}`} />
      <div className="p-4">
        <div className={`h-4 rounded-lg w-3/4 mb-2 ${d ? "bg-white/8" : "bg-black/8"}`} />
        <div className={`h-3 rounded-lg w-full mb-1 ${d ? "bg-white/5" : "bg-black/5"}`} />
        <div className={`h-3 rounded-lg w-2/3 mb-4 ${d ? "bg-white/5" : "bg-black/5"}`} />
        <div className={`h-5 rounded-lg w-1/2 mb-4 ${d ? "bg-white/8" : "bg-black/8"}`} />
        <div className="flex gap-2">
          <div className={`flex-1 h-9 rounded-xl ${d ? "bg-white/5" : "bg-black/5"}`} />
          <div className={`flex-1 h-9 rounded-xl ${d ? "bg-white/8" : "bg-black/8"}`} />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton({ isDark = true }: SkeletonProps) {
  const d = isDark
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className={`h-4 rounded-lg w-32 mb-8 ${d ? "bg-white/8" : "bg-black/8"}`} />
      <div className="flex flex-col lg:flex-row gap-10">
        <div className={`flex-1 h-72 rounded-2xl ${d ? "bg-white/5" : "bg-black/5"}`} />
        <div className="flex-1 flex flex-col gap-4">
          <div className={`h-8 rounded-lg w-2/3 ${d ? "bg-white/8" : "bg-black/8"}`} />
          <div className={`h-4 rounded-lg w-full ${d ? "bg-white/5" : "bg-black/5"}`} />
          <div className={`h-4 rounded-lg w-3/4 ${d ? "bg-white/5" : "bg-black/5"}`} />
          <div className={`h-10 rounded-lg w-1/3 mt-2 ${d ? "bg-white/8" : "bg-black/8"}`} />
          <div className={`h-12 rounded-xl mt-2 ${d ? "bg-white/5" : "bg-black/5"}`} />
          <div className="flex gap-3 mt-4">
            <div className={`flex-1 h-12 rounded-xl ${d ? "bg-white/5" : "bg-black/5"}`} />
            <div className={`flex-1 h-12 rounded-xl ${d ? "bg-white/8" : "bg-black/8"}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderCardSkeleton({ isDark = true }: SkeletonProps) {
  const d = isDark
  return (
    <div className={`border rounded-2xl p-6 animate-pulse ${d ? "bg-white/4 border-white/8" : "bg-white border-black/8"}`}>
      <div className="flex justify-between mb-4">
        <div>
          <div className={`h-3 rounded w-24 mb-2 ${d ? "bg-white/5" : "bg-black/5"}`} />
          <div className={`h-5 rounded w-40 ${d ? "bg-white/8" : "bg-black/8"}`} />
        </div>
        <div className={`h-6 rounded-full w-20 ${d ? "bg-white/8" : "bg-black/8"}`} />
      </div>
      <div className={`rounded-xl p-3 mb-4 flex flex-col gap-2 ${d ? "bg-white/2" : "bg-black/2"}`}>
        <div className={`h-4 rounded w-full ${d ? "bg-white/5" : "bg-black/5"}`} />
        <div className={`h-4 rounded w-3/4 ${d ? "bg-white/5" : "bg-black/5"}`} />
      </div>
      <div className={`border-t pt-4 flex justify-between ${d ? "border-white/8" : "border-black/8"}`}>
        <div className={`h-4 rounded w-32 ${d ? "bg-white/5" : "bg-black/5"}`} />
        <div className={`h-5 rounded w-24 ${d ? "bg-white/8" : "bg-black/8"}`} />
      </div>
    </div>
  )
}