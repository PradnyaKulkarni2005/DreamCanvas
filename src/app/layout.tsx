// app/layout.tsx
import './globals.css';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';

export const metadata = {
  title: 'AI Skill Gap Analyzer',
  description: 'Find your skill gaps and get a custom roadmap',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BackgroundWrapper>
          {children}
        </BackgroundWrapper>
      </body>
    </html>
  );
}
