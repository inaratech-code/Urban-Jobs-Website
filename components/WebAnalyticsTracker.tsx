"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackWebView } from "@/lib/firestore";

const KEY = "urban_jobs_last_tracked";

export default function WebAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const now = Date.now();
    const lastRaw = localStorage.getItem(KEY);
    const last = lastRaw ? Number(lastRaw) : 0;

    // throttle event spam on fast reloads/navigation
    if (now - last < 1500) return;
    localStorage.setItem(KEY, String(now));

    trackWebView(pathname).catch(() => {
      // ignore analytics errors
    });
  }, [pathname]);

  return null;
}

