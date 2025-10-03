"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Dashboard } from "@/components/dashboard"
import { InteractiveHandpan } from "@/components/interactive-handpan"
import { SongLibrary } from "@/components/song-library"
import { Devotions } from "@/components/devotions"

type Section = "dashboard" | "handpan" | "songs" | "devotions"

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-zinc-900 dark:via-amber-950 dark:to-orange-950 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="container mx-auto px-4 py-8">
        {activeSection === "dashboard" && <Dashboard onNavigate={setActiveSection} />}
        {activeSection === "handpan" && <InteractiveHandpan />}
        {activeSection === "songs" && <SongLibrary />}
        {activeSection === "devotions" && <Devotions />}
      </div>
    </main>
  )
}
