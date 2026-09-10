export const Skeleton = ({ className = "" }: { className: string }) => {
  return <div className={`animate-pulse bg-paper-warm ${className}`} />;
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="rounded-xl aspect-[4/5] w-full" />
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
    <div className="flex py-10 px-4 bg-paper-dim/30 rounded-xl items-center justify-between">
      <Skeleton className="rounded-xl h-16 w-28" />
      <div className="flex flex-col gap-2">
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
    <div className="flex flex-col gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <OrderSkeleton key={i} />
      ))}
    </div>
  );
};

export const OrderDetailsSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="rounded-xl h-20 w-28" />
      <div className=" flex flex-col gap-2">
        <Skeleton className="h-3 w-19 rounded-xl" />
        <Skeleton className="h-3 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-3 w-19 rounded-xl" />
    </div>
  );
};

export const OrderDetailsGridSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
      <div className="flex flex-col gap-10">
        <div className="flex gap-5 flex-row items-end justify-between">
          <div className="flex gap-5 flex-col">
            <Skeleton className="rounded-xl h-4 w-20" />
            <Skeleton className="rounded-xl h-4 w-32" />
            <Skeleton className="rounded-xl h-4 w-24" />
          </div>
          <Skeleton className="rounded-xl h-4 w-20" />
        </div>

        {Array.from({ length: count }).map((_, i) => (
          <OrderDetailsSkeleton key={i} />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="mb-5 rounded-xl h-35 w-full" />
        <Skeleton className="rounded-xl h-30 w-full" />
        <Skeleton className="rounded-xl h-30 w-full" />
      </div>
    </div>
  );
};

export const ProductInfoSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div
        className="mb-6 h-4 w-48 rounded-xl animate-pulse bg-paper-dim"
        aria-hidden="true"
      />
      <div
        className="mb-6 h-4 w-full rounded-xl animate-pulse bg-paper-dim"
        aria-hidden="true"
      />
      <div
        className="mb-6 h-10 w-50 rounded-xl animate-pulse bg-paper-dim"
        aria-hidden="true"
      />
      <div
        className="mb-6 h-4 w-48 rounded-xl animate-pulse bg-paper-dim"
        aria-hidden="true"
      />
      <div
        className="mb-6 h-10 w-full rounded-xl animate-pulse bg-paper-dim"
        aria-hidden="true"
      />

      <div
        className="h-20 w-full rounded-xl animate-pulse bg-paper-dim"
        aria-hidden="true"
      />
    </div>
  );
};

export const AdminUsersSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="mt-2 h-4 w-24 rounded-md" />
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-paper-warm">
        <div className="divide-y divide-paper-warm">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
                <Skeleton className="mt-2 h-3 w-50 rounded-md" />
                <Skeleton className="mt-2 h-4 w-44 rounded-md" />
                <Skeleton className="mt-2 h-3 w-34 rounded-md" />
              </div>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminOrdersSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div>
      <div>
        <Skeleton className="h-5 w-20 rounded-xl" />
        <Skeleton className="mt-2 h-4 w-40 rounded-xl" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-7 w-full rounded-xl" />
      </div>
      <div className="mt-6 overflow-hidden border border-paper-warm rounded-xl">
        <div className="divide-y divide-paper-warm">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col px-4 py-4 lg:flex-row lg:justify-between lg:gap-6"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-3 w-30 rounded-xl" />
                  <Skeleton className="h-4 w-20 rounded-xl" />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-2">
                  <Skeleton className="h-3 w-20 rounded-xl" />
                  <Skeleton className="h-3 w-20 rounded-xl" />
                </div>
              </div>
              <div className="mt-2 flex w-full items-center justify-between gap-4 sm:justify-end lg:w-auto">
                <Skeleton className="h-4 w-16 rounded-xl" />
                <Skeleton className="h-4 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminProductsSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="mt-6 divide-y divide-paper-warm border-y border-paper-warm">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center justify-between gap-4 py-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div>
              <div className="flex items-start lg:flex-row gap-2 lg:gap-3">
                <Skeleton className="h-4 w-24 rounded-xl" />
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Skeleton className="h-4 w-14 rounded-xl" />
                <Skeleton className="h-4 w-10 rounded-xl" />
              </div>
            </div>
            <Skeleton className="hidden lg:block ml-20 h-4 w-16 rounded-xl" />
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Skeleton className="h-5 w-8 rounded-xl" />
            <Skeleton className="h-5 w-8 rounded-xl" />
            <Skeleton className="h-5 w-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminUsersDetailSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-20 rounded-xl" />
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-24 w-50 rounded-2xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-20 rounded-2xl" />
          <Skeleton className="h-5 w-20 rounded-2xl" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-24 rounded-xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10 rounded-xl" />
          <Skeleton className="h-4 w-10 rounded-xl" />
        </div>
      </div>

      <div className="mt-4 divide-y divide-line-light border-y border-line-light">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24 rounded-xl" />
                <Skeleton className="h-5 w-20 rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32 rounded-xl" />
                <Skeleton className="h-4 w-20 rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-4 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
