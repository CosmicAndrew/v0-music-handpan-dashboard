import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const geistSans = GeistSans

export const metadata: Metadata = {
  title: "Handpan Worship Suite - 432 Hz D Kurd 10",
  description:
    "Interactive handpan worship experience with YataoPan D Kurd 10 tuned to 432 Hz. Includes worship songs, devotional content, and authentic handpan playing interface.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
