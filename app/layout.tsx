import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import "./mobile.css"
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
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Handpan 432Hz",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Handpan Worship Suite - 432 Hz",
    description: "Sacred 432Hz handpan worship experience",
    type: "website",
    siteName: "Handpan Worship Suite",
  },
  twitter: {
    card: "summary_large_image",
    title: "Handpan Worship Suite - 432 Hz",
    description: "Sacred 432Hz handpan worship experience",
  },
  icons: {
    icon: [
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8B4513" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable}`}>
      <body className="font-sans antialiased safe-area-top safe-area-bottom">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
