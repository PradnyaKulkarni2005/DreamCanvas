// app/layout.tsx
'use client';

import './globals.css';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/app/libs/supabaseClient';

const metadata = {
  title: 'AI Skill Gap Analyzer',
  description: 'Find your skill gaps and get a custom roadmap',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          <BackgroundWrapper>
            {children}
          </BackgroundWrapper>
        </SessionContextProvider>
      </body>
    </html>
  );
}
