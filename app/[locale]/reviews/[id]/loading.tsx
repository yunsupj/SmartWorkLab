export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      {/* Header Skeleton */}
      <div className="text-center mb-10 space-y-4">
        <div className="h-6 w-32 bg-slate-800 rounded-full mx-auto animate-pulse"></div>
        <div className="h-12 w-3/4 bg-slate-800 rounded mx-auto animate-pulse"></div>
        <div className="h-8 w-24 bg-slate-800 rounded mx-auto animate-pulse"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Main Content Skeleton */}
          <div className="h-64 bg-slate-900 rounded-xl animate-pulse"></div>
          <div className="h-48 bg-slate-900 rounded-xl animate-pulse"></div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="h-32 bg-slate-900 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-slate-900 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-slate-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
