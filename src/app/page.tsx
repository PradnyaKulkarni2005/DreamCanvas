import VantaDotsBackground from "@/app/components/VantaDotsBackground";
import Link from 'next/link';

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <VantaDotsBackground />
      <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-white">AI Skill Gap Analyzer</h1>
      <p className="mb-6 text-white">Discover what skills you need and get a 30-day roadmap</p>
      <Link href="/analyze" className="group relative inline-block font-semibold leading-6 text-white shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600 rounded-2xl bg-neutral-900 p-px shadow-emerald-900">
  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
  <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
    <div className="relative z-10 flex items-center space-x-3">
      <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300">
        Get Started
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
      >
        <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
      </svg>
    </div>
  </span>
</Link>

    </div>
    </main>
  );
}


