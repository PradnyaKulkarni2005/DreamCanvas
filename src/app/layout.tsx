// src/app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'AI Skill Enhancer',
  description: 'Analyze and enhance your skills for your dream job',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-800 antialiased">
        <main className="mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
