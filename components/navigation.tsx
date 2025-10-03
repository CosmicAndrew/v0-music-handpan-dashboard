"use client"

import { Music, Home, Library, BookOpen } from "@/components/icons"
import { Button } from "@/components/ui/button"

type Section = "dashboard" | "handpan" | "songs" | "devotions"

interface NavigationProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: "dashboard" as Section, label: "Dashboard", icon: Home },
    { id: "handpan" as Section, label: "Handpan", icon: Music },
    { id: "songs" as Section, label: "Songs", icon: Library },
    { id: "devotions" as Section, label: "Devotions", icon: BookOpen },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/15 border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Handpan Worship
              </h1>
              <p className="text-xs text-gray-600">432 Hz • D Kurd 10</p>
            </div>
          </div>

          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className="gap-2 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
