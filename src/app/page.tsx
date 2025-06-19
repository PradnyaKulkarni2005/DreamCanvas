import VantaDotsBackground from "@/app/components/VantaDotsBackground";
import Link from 'next/link';

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <VantaDotsBackground />
      <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-white">AI Skill Gap Analyzer</h1>
      <p className="mb-6 text-white">Discover what skills you need and get a 30-day roadmap</p>
      <Link href="/analyze" className="bg-pink-600 text-white px-6 py-3 rounded hover:bg-red-700">
        Get Started
      </Link>
    </div>
    </main>
  );
}


