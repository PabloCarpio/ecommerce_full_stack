export default function HomeLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="py-20 md:py-32">
        <div className="container flex flex-col items-center text-center gap-6">
          <div className="h-12 md:h-16 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="flex gap-4">
            <div className="h-12 w-36 bg-muted rounded" />
            <div className="h-12 w-36 bg-muted rounded" />
          </div>
        </div>
      </section>
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted rounded-lg" />
          ))}
        </div>
      </section>
      <section className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border overflow-hidden">
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-6 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}