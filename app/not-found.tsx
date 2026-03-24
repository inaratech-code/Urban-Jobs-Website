import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-6xl font-bold text-slate-300">404</h1>
          <p className="mt-2 text-slate-600 text-lg">This page could not be found.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
            >
              Browse jobs
            </Link>
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
            >
              Admin
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
