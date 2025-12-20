// app/layout.tsx
'use client';

import './globals.css';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ChatbotLauncher from '@/app/components/ChatbotLauncher';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/app/_libs/supabaseClient';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Chewy&family=Fredoka:wdth,wght@80.8,300..700&family=Luckiest+Guy&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-roboto m-0 p-0 bg-[#0d1117] min-h-screen text-white">
        <SessionContextProvider supabaseClient={supabase}>
          <BackgroundWrapper>
            {children}

            {/* 🌟 Global AI Career Chatbot */}
            <ChatbotLauncher />
          </BackgroundWrapper>
        </SessionContextProvider>
      </body>
    </html>
  );
}
