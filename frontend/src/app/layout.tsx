import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import Sidebar from "@/components/Sidebar"
import BottomNav from "@/components/BottomNav"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "E-Tunes - Aural Training",
  description: "Transcription, ear training, and scale learning",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
