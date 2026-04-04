"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { onAuthChange, signOut, isAdminEmail, hasDemoSession, getDemoCredentials } from "@/lib/auth";
import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
  HiOutlineChartBarSquare,
  HiArrowRightOnRectangle,
  HiOutlineInboxArrowDown,
  HiOutlineRectangleStack,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";

const nav = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { href: "/admin/analytics", label: "Analytics", icon: HiOutlineChartBarSquare },
  { href: "/admin/candidates", label: "Candidates", icon: HiOutlineUserGroup },
  { href: "/admin/employers", label: "Employers", icon: HiOutlineBuildingOffice2 },
  { href: "/admin/employer-jobs", label: "Employer jobs", icon: HiOutlineRectangleStack },
  { href: "/admin/jobs", label: "Jobs", icon: HiOutlineBriefcase },
  { href: "/admin/applications", label: "Applications", icon: HiOutlineClipboardDocumentList },
  { href: "/admin/job-requests", label: "Job requests", icon: HiOutlineInboxArrowDown },
];

function AdminShell({ user, children }: { user: { email: string | null }; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const closeSidebar = () => setSidebarOpen(false);

  const handleSignOut = () => {
    signOut().then(() => {
      router.replace("/admin/login");
      window.location.reload();
    });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col lg:flex-row">
      <header className="lg:hidden sticky top-0 z-[60] flex items-center justify-between gap-3 min-h-14 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top,0px))] bg-white border-b border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 touch-manipulation"
          aria-expanded={sidebarOpen}
          aria-label="Open navigation menu"
        >
          <HiBars3 className="h-6 w-6" />
        </button>
        <span className="font-display font-semibold text-slate-800 truncate text-center flex-1 text-sm sm:text-base">
          Urban Jobs — Admin
        </span>
        <span className="w-10 shrink-0" aria-hidden />
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-[70] bg-slate-900/45"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed z-[80] top-0 bottom-0 left-0 w-64 max-w-[min(16rem,calc(100vw-1rem))] bg-white border-r border-slate-200 shadow-soft flex flex-col transition-transform duration-200 ease-out lg:static lg:z-auto lg:max-w-none lg:w-64 lg:translate-x-0 lg:min-h-screen lg:shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-2 shrink-0">
          <Link href="/admin" className="flex items-center gap-3 min-w-0" onClick={closeSidebar}>
            <span className="flex h-14 min-h-14 max-w-[148px] items-center justify-start rounded-2xl shadow-soft border border-slate-100 bg-white px-2 py-1.5 shrink-0">
              <BrandLogo height={44} />
            </span>
            <div className="min-w-0">
              <p className="font-display font-semibold text-slate-800 leading-tight truncate">Urban Jobs</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 touch-manipulation shrink-0"
            aria-label="Close menu"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto overscroll-contain min-h-0">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-sm font-medium transition-colors touch-manipulation ${
                pathname === item.href ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 sm:p-4 border-t border-slate-100 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
          <p className="text-xs text-slate-500 truncate px-3 sm:px-4" title={user.email || ""}>
            {user.email}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 w-full touch-manipulation"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 md:p-8 lg:p-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string | null } | null | undefined>(undefined);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (hasDemoSession()) {
      setUser({ email: getDemoCredentials()?.email ?? "admin@demo.com" });
      return;
    }
    const unsub = onAuthChange((u) => {
      if (!u) {
        setUser(null);
        router.replace("/admin/login");
        return;
      }
      if (!isAdminEmail(u.email || "")) {
        signOut();
        router.replace("/admin/login");
        return;
      }
      setUser({ email: u.email || null });
    });
    return () => unsub();
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (user === null) {
    return null;
  }

  if (user === undefined) {
    return (
      <AdminShell user={{ email: "..." }}>
        <div className="flex items-center justify-center py-20">
          <span className="text-slate-400 text-sm">Verifying access...</span>
        </div>
      </AdminShell>
    );
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
