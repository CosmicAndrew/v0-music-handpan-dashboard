import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Suspense } from "react"
import { PWAInstaller } from "@/components/pwa-installer"
import { ThemeHandler } from "@/components/theme-handler"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const geistSans = GeistSans

export const metadata: Metadata = {
  title: "Handpan Worship",
  description:
    "Interactive handpan worship experience with YataoPan D Kurd 10 tuned to 432 Hz. Includes worship songs, devotional content, and authentic handpan playing interface.",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Handpan Worship",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#312e81" },
  ],
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ThemeHandler />
        <Suspense fallback={null}>{children}</Suspense>
        <PWAInstaller />
      </body>
    </html>
  )
}
