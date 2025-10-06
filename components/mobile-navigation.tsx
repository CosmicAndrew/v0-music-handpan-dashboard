"use client"

import { Home, Music, BookOpen, Heart, Settings, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavigationProps {
  activeSection: string
  setActiveSection: (section: any) => void
}

export function MobileNavigation({ activeSection, setActiveSection }: MobileNavigationProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "handpan", icon: Music, label: "Play" },
    { id: "songs", icon: BookOpen, label: "Songs" },
    { id: "devotions", icon: Heart, label: "Worship" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 touch-target ${
              activeSection === id ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveSection(id)}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  )
}