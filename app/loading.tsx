import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-56 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-80 bg-slate-100 rounded mt-3 animate-pulse" />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100"
              >
                <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-slate-200 rounded mt-4 animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded mt-3 animate-pulse" />
                <div className="h-10 w-full sm:w-40 bg-slate-200 rounded-xl mt-6 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

