// app/layout.tsx
'use client';

import './globals.css';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/app/libs/supabaseClient';


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
