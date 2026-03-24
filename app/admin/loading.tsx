export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-soft fixed h-full" />
      <main className="flex-1 ml-64 p-8">
        <div className="h-8 w-44 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded mt-3 animate-pulse" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100"
            >
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-slate-200 rounded mt-4 animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

