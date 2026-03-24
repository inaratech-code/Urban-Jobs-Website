"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { onAuthChange, signOut, isAdminEmail, hasDemoSession, getDemoCredentials } from "@/lib/auth";
import { HiOutlineSquares2X2, HiOutlineUserGroup, HiOutlineBuildingOffice2, HiOutlineBriefcase, HiOutlineClipboardDocumentList, HiOutlineChartBarSquare, HiArrowRightOnRectangle } from "react-icons/hi2";

const nav = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { href: "/admin/analytics", label: "Analytics", icon: HiOutlineChartBarSquare },
  { href: "/admin/candidates", label: "Candidates", icon: HiOutlineUserGroup },
  { href: "/admin/employers", label: "Employers", icon: HiOutlineBuildingOffice2 },
  { href: "/admin/jobs", label: "Jobs", icon: HiOutlineBriefcase },
  { href: "/admin/applications", label: "Applications", icon: HiOutlineClipboardDocumentList },
];

function AdminShell({ user, children }: { user: { email: string | null }; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-soft flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-soft border border-slate-100 bg-white">
              <Image
                src="/logo.png"
                alt="Urban Jobs"
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div>
              <p className="font-display font-semibold text-slate-800 leading-tight">Urban Jobs</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 truncate px-4" title={user.email || ""}>
            {user.email}
          </p>
          <button
            type="button"
            onClick={() => { signOut().then(() => { router.replace("/admin/login"); window.location.reload(); }); }}
            className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 w-full"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string | null } | null | undefined>(
    undefined
  );

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

