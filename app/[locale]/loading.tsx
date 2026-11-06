export default function Loading() {
  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="animate-pulse space-y-12">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <div className="h-12 bg-[#EFF0EB] rounded w-1/2 mx-auto"></div>
          <div className="h-6 bg-[#EFF0EB] rounded w-1/3 mx-auto"></div>
        </div>

        {/* Price Tracker Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-[#EFF0EB] rounded w-32"></div>
          <div className="h-20 bg-[#EFF0EB] rounded w-full"></div>
        </div>

        {/* Top Picks Skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-[#EFF0EB] rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#FFFFFF] border border-[#E4E7E2] rounded-lg p-6 h-64">
                <div className="h-6 bg-[#EFF0EB] rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-[#EFF0EB] rounded w-full mb-2"></div>
                <div className="h-4 bg-[#EFF0EB] rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
