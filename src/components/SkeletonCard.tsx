import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => (
  <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden flex flex-col md:flex-row">
    <Skeleton className="md:w-72 h-48 md:h-auto flex-shrink-0 rounded-none" />
    <div className="p-5 flex-1 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-12 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
