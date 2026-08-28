export const Skeleton = ({ className = "" }: { className: string }) => {
  return <div className={`animate-pulse bg-paper-warm ${className}`} />;
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

export const OrderSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="rounded-md h-15 w-28" />
      <div className="-ml-8 flex flex-col gap-2">
        <Skeleton className="h-3 w-16  rounded-xl" />
        <Skeleton className="h-3 w-20 rounded-xl" />
        <Skeleton className="h-3 w-12 rounded-xl" />
      </div>
      <Skeleton className="h-3 w-19 rounded-xl" />
      <Skeleton className="h-3 w-10 rounded-xl" />
    </div>
  );
};

export const OrderGridSkeleton = ({ count = 2 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-15">
      {Array.from({ length: count }).map((_, i) => (
        <OrderSkeleton key={i} />
      ))}
    </div>
  );
};
