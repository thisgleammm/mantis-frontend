import { Skeleton } from "@heroui/react";
import { Card } from "./Card";

export function ProductCardSkeleton() {
  return (
    <Card className="border border-black/8 bg-white dark:border-white/8 dark:bg-white/4">
      <Skeleton className="aspect-[4/3] w-full" />
      <Card.Header className="flex flex-col gap-3 p-4">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-5 w-2/3 rounded-lg" />
          <Skeleton className="h-4 w-10 rounded-lg" />
        </div>
      </Card.Header>
      <Card.Content className="px-4 pb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-1/2 rounded-lg" />
          <Skeleton className="h-3 w-1/4 rounded-lg" />
        </div>
      </Card.Content>
    </Card>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <Skeleton className="h-4 rounded-lg w-32 mb-8" />
      <div className="flex flex-col lg:flex-row gap-10">
        <Skeleton className="flex-1 h-72 lg:h-[400px] rounded-2xl" />
        <div className="flex-1 flex flex-col gap-5">
          <Skeleton className="h-10 rounded-lg w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 rounded-lg w-full" />
            <Skeleton className="h-4 rounded-lg w-3/4" />
            <Skeleton className="h-4 rounded-lg w-5/6" />
          </div>
          <Skeleton className="h-12 rounded-lg w-1/3 mt-4" />
          <Skeleton className="h-14 rounded-xl mt-4" />
          <div className="flex gap-3 mt-6">
            <Skeleton className="flex-1 h-14 rounded-xl" />
            <Skeleton className="flex-1 h-14 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="border rounded-2xl p-6 bg-white border-black/8 dark:bg-white/4 dark:border-white/8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-3 rounded w-24" />
          <Skeleton className="h-6 rounded w-40" />
        </div>
        <Skeleton className="h-8 rounded-full w-24" />
      </div>
      <div className="rounded-xl p-4 mb-6 space-y-3 bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5">
        <Skeleton className="h-4 rounded w-full" />
        <Skeleton className="h-4 rounded w-3/4" />
      </div>
      <div className="border-t pt-6 flex justify-between items-center border-black/8 dark:border-white/8">
        <Skeleton className="h-4 rounded w-32" />
        <Skeleton className="h-6 rounded w-24" />
      </div>
    </div>
  );
}