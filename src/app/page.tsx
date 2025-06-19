import VantaDotsBackground from "@/app/components/VantaDotsBackground";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <VantaDotsBackground />
      <div className="relative z-10 flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-white">AI Skill Enhancer</h1>
      </div>
    </main>
  );
}
