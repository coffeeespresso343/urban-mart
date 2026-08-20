export const Skeleton = ({ className = "" }: { className: string }) => {
  return <div className={`animate-pulse bg-paper-dim ${className}`} />;
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="rounded-md aspect-[4/5] w-full" />
      <Skeleton className="rounded-xl h-3 w-3/4" />
      <Skeleton className="rounded-xl h-3 w-14" />
      <Skeleton className="rounded-xl h-3 w-16" />
      <Skeleton className="rounded-xl h-3 w-9" />
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
