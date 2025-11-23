
// Loading Skeleton Component
export  const LoadingSkeleton = () => (
  <div className="space-y-8 p-6">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
    </div>

    {/* Search Bar Skeleton */}
    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>

    {/* Table Skeleton */}
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
      ))}
    </div>
  </div>
);