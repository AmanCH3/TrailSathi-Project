import { cn } from '@/lib/utils';

export const Skeleton = ({ className, ...props }) => (
  <div
    className={cn('animate-pulse bg-slate-800 rounded', className)}
    {...props}
  />
);

export const SkeletonCard = () => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
    <Skeleton className="h-32 w-full mb-4 rounded-xl" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export const SkeletonPost = () => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-4" />
    <Skeleton className="h-48 w-full rounded-xl" />
  </div>
);
