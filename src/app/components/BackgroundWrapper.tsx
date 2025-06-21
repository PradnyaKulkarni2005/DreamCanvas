// app/components/BackgroundWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import VantaDotsBackground from './VantaDotsBackground';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={isHomePage ? '' : 'bg-[#0d1117] text-white min-h-screen'}>
      {isHomePage && <VantaDotsBackground />}
      {children}
    </div>
  );
}
