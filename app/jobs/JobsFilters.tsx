"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const CATEGORIES = [
  "Teaching Jobs",
  "Hotel Management",
  "Reception / Admin",
  "Accounting",
  "IT / Management",
];

export default function JobsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const apply = useCallback(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    const currentCategory = searchParams.get("category");
    if (currentCategory) p.set("category", currentCategory);
    if (location) p.set("location", location);
    router.push(`/jobs?${p.toString()}`);
  }, [router, search, location, searchParams]);

  return (
    <div className="mt-6 p-4 sm:p-5 bg-white rounded-2xl shadow-soft border border-slate-100">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={apply}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}
