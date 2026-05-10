export default function ProductsLoading() {
  return (
    <div className="container py-8">
      <div className="h-10 bg-muted rounded w-48 mb-8 animate-pulse" />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-24 animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded w-32 animate-pulse" />
            ))}
            <div className="h-6 bg-muted rounded w-24 animate-pulse mt-6" />
            <div className="flex gap-2">
              <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
              <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}