"use client";

export function DashboardSkeleton() {
  return (
    <div>
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-72 mt-2 bg-slate-100 rounded animate-pulse" />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-16 mt-3 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex gap-4 py-4 px-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 flex-1 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-4 px-6">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-4 flex-1 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100">
          <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-64 mt-2 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-48 mt-2 bg-slate-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
