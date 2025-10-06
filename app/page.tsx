"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { InteractiveHandpan } from "@/components/interactive-handpan"
import { SongLibrary } from "@/components/song-library"
import { Devotions } from "@/components/devotions"
import { ExportProgress } from "@/components/export-progress"
import { RecentlyPlayed } from "@/components/recently-played"
import { Settings } from "@/components/settings"
import { useTheme } from "@/hooks/use-theme"
import { PWAManager } from "@/components/pwa-manager"
import { MobileNavigation } from "@/components/mobile-navigation"

type Section = "dashboard" | "handpan" | "songs" | "devotions" | "settings" | "export"

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [activeCard, setActiveCard] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)

  useEffect(() => {
    console.log("[v0] Theme changed:", resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (activeSection === "dashboard" && !isDragging) {
      const timer = setInterval(() => {
        setActiveCard((current) => (current === 5 ? 1 : current + 1))
      }, 8000)
      return () => clearInterval(timer)
    }
  }, [activeSection, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragOffset(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const offset = e.clientX - dragStartX
    setDragOffset(offset)
  }

  const handleMouseUp = () => {
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset < 0 && activeCard < 5) {
        setActiveCard(activeCard + 1)
      } else if (dragOffset > 0 && activeCard > 1) {
        setActiveCard(activeCard - 1)
      }
    }
    setIsDragging(false)
    setDragOffset(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragOffset(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const offset = e.touches[0].clientX - dragStartX
    setDragOffset(offset)
  }

  const handleTouchEnd = () => {
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset < 0 && activeCard < 5) {
        setActiveCard(activeCard + 1)
      } else if (dragOffset > 0 && activeCard > 1) {
        setActiveCard(activeCard - 1)
      }
    }
    setIsDragging(false)
    setDragOffset(0)
  }

  return (
    <main className="app-container min-h-screen relative overflow-hidden" data-theme={resolvedTheme}>
      <div className="spline-container absolute top-0 left-0 w-full h-full -z-10">
        <iframe
          src="https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          title="3D Background"
        />
      </div>

      <header className="pastel-glass-header sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10">
                  <defs>
                    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#93c5fd" />
                      <stop offset="100%" stopColor="#c4b5fd" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="10" fill="url(#brandGradient)" opacity="0.3" />
                  <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#93c5fd">
                    🪘
                  </text>
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">Handpan Worship Studio</h1>
                <span className="text-xs text-white/80 hidden sm:block">Design your worship experience</span>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <button
                className={`pastel-nav-item ${activeSection === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveSection("dashboard")}
              >
                <span className="nav-icon">🎴</span>
                <span className="nav-label hidden sm:inline">Dashboard</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => setActiveSection("settings")}
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-label hidden sm:inline">Settings</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "handpan" ? "active" : ""}`}
                onClick={() => setActiveSection("handpan")}
              >
                <span className="nav-icon">🪘</span>
                <span className="nav-label hidden sm:inline">Handpan</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "songs" ? "active" : ""}`}
                onClick={() => setActiveSection("songs")}
              >
                <span className="nav-icon">🎵</span>
                <span className="nav-label hidden sm:inline">Library</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "devotions" ? "active" : ""}`}
                onClick={() => setActiveSection("devotions")}
              >
                <span className="nav-icon">✞</span>
                <span className="nav-label hidden sm:inline">Devotions</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "export" ? "active" : ""}`}
                onClick={() => setActiveSection("export")}
              >
                <span className="nav-icon">📦</span>
                <span className="nav-label hidden sm:inline">Export</span>
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div className="pastel-badge">
                <div className="status-dot" />
                <span className="text-xs font-medium text-white">System Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="pastel-badge-accent">40 Songs</span>
                <span className="pastel-badge-accent">432Hz</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 pb-8">
        {activeSection === "dashboard" && (
          <>
            <div className="min-h-[70vh] flex items-center justify-center py-8">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                <div className="space-y-6 sm:space-y-8 fade-up">
                  <div className="space-y-4">
                    <div className="pastel-badge inline-flex">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-white uppercase tracking-wide">Worship Platform</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                      Transform Your
                      <span className="block text-white">Worship Experience</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                      Sacred 432Hz handpan with 40+ worship songs, biblical devotions, and interactive practice tools.
                      Drag through features to discover your spiritual journey.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setActiveCard(num)}
                        className={`transition-all ${
                          activeCard === num
                            ? "w-8 h-3 bg-white rounded-full"
                            : "w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full"
                        }`}
                        aria-label={`Go to card ${num}`}
                      />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-white">27 Perfect Match songs in F & Dm keys</span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-white">Interactive handpan with authentic 432Hz tuning</span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-white">Righteousness devotions with biblical meditation</span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-white">Practice analytics and progress tracking</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <div
                    className={`worship-cards-section feature-${activeCard}-active ${isDragging ? "dragging" : ""}`}
                    style={{ height: "36rem", cursor: isDragging ? "grabbing" : "grab" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="worship-feature-card pastel-card"
                      style={{
                        height: "36rem",
                        background:
                          "linear-gradient(135deg, rgba(147, 197, 253, 0.4) 0%, rgba(196, 181, 253, 0.4) 100%)",
                        transform: activeCard === 1 ? `translateX(${dragOffset}px)` : undefined,
                        transition: isDragging ? "none" : "transform 0.3s ease-out",
                      }}
                    >
                      <div className="flex flex-col h-full text-white">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="card-icon-badge">
                              <span className="text-2xl">🎵</span>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-wide opacity-90">Feature 1</span>
                              <h3 className="text-2xl font-bold">Perfect Match Songs</h3>
                            </div>
                          </div>
                          <button
                            className="card-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                            aria-label="Menu"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                            </svg>
                          </button>
                        </div>

                        <p className="text-lg opacity-90 mb-6 flex-1">
                          27 premium worship songs perfectly compatible with YataoPan D Kurd 10 in F & Dm keys. Includes
                          Way Maker, Goodness of God, Build My Life, and more.
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="card-stat-row">
                            <span className="opacity-80">Total Songs</span>
                            <span className="font-semibold">27 tracks</span>
                          </div>
                          <div className="card-stat-row">
                            <span className="opacity-80">Compatibility</span>
                            <span className="font-semibold">Perfect Match</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            className="studio-button primary flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("songs")
                            }}
                          >
                            Explore Library →
                          </button>
                          <button
                            className="studio-button secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                          >
                            Menu
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className="worship-feature-card pastel-card"
                      style={{
                        height: "36rem",
                        background: "linear-gradient(135deg, rgba(140, 92, 246, 0.4) 0%, rgba(228, 72, 153, 0.4) 100%)",
                        transform: activeCard === 2 ? `translateX(${dragOffset}px)` : undefined,
                        transition: isDragging ? "none" : "transform 0.3s ease-out",
                      }}
                    >
                      <div className="flex flex-col h-full text-white">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="card-icon-badge">
                              <span className="text-2xl">🪘</span>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-wide opacity-90">Feature 2</span>
                              <h3 className="text-2xl font-bold">Interactive Handpan</h3>
                            </div>
                          </div>
                          <button
                            className="card-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                            aria-label="Menu"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                            </svg>
                          </button>
                        </div>

                        <p className="text-lg opacity-90 mb-6 flex-1">
                          Practice with authentic YataoPan D Kurd 10 sounds tuned to sacred 432Hz frequency. Includes
                          patterns, chords, and meditation modes.
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="card-stat-row">
                            <span className="opacity-80">Tuning</span>
                            <span className="font-semibold">432Hz Sacred</span>
                          </div>
                          <div className="card-stat-row">
                            <span className="opacity-80">Notes</span>
                            <span className="font-semibold">10 (D Kurd)</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            className="studio-button primary flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("handpan")
                            }}
                          >
                            Play Handpan →
                          </button>
                          <button
                            className="studio-button secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                          >
                            Menu
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className="worship-feature-card pastel-card"
                      style={{
                        height: "36rem",
                        background: "linear-gradient(135deg, rgba(228, 72, 153, 0.4) 0%, rgba(245, 158, 11, 0.4) 100%)",
                        transform: activeCard === 3 ? `translateX(${dragOffset}px)` : undefined,
                        transition: isDragging ? "none" : "transform 0.3s ease-out",
                      }}
                    >
                      <div className="flex flex-col h-full text-white">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="card-icon-badge">
                              <span className="text-2xl">✞</span>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-wide opacity-90">Feature 3</span>
                              <h3 className="text-2xl font-bold">Righteousness Devotions</h3>
                            </div>
                          </div>
                          <button
                            className="card-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                            aria-label="Menu"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                            </svg>
                          </button>
                        </div>

                        <p className="text-lg opacity-90 mb-6 flex-1">
                          Biblical meditation on Blood Covenant, Cross Victory, and Gospel Foundation with handpan
                          accompaniment for spiritual growth.
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="card-stat-row">
                            <span className="opacity-80">Devotions</span>
                            <span className="font-semibold">3 meditations</span>
                          </div>
                          <div className="card-stat-row">
                            <span className="opacity-80">Theme</span>
                            <span className="font-semibold">Righteousness</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            className="studio-button primary flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("devotions")
                            }}
                          >
                            Read Devotions →
                          </button>
                          <button
                            className="studio-button secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                          >
                            Menu
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className="worship-feature-card pastel-card"
                      style={{
                        height: "36rem",
                        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(16, 185, 130, 0.4) 100%)",
                        transform: activeCard === 4 ? `translateX(${dragOffset}px)` : undefined,
                        transition: isDragging ? "none" : "transform 0.3s ease-out",
                      }}
                    >
                      <div className="flex flex-col h-full text-white">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="card-icon-badge">
                              <span className="text-2xl">🎯</span>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-wide opacity-90">Feature 4</span>
                              <h3 className="text-2xl font-bold">Extended Practice</h3>
                            </div>
                          </div>
                          <button
                            className="card-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                            aria-label="Menu"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                            </svg>
                          </button>
                        </div>

                        <p className="text-lg opacity-90 mb-6 flex-1">
                          Expand your repertoire with 13 additional songs in C & Bb keys. Strong and creative matches
                          for advanced worship practice.
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="card-stat-row">
                            <span className="opacity-80">Additional Songs</span>
                            <span className="font-semibold">13 tracks</span>
                          </div>
                          <div className="card-stat-row">
                            <span className="opacity-80">Keys</span>
                            <span className="font-semibold">C & Bb</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            className="studio-button primary flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("songs")
                            }}
                          >
                            View All Songs →
                          </button>
                          <button
                            className="studio-button secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                          >
                            Menu
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className="worship-feature-card pastel-card"
                      style={{
                        height: "36rem",
                        background:
                          "linear-gradient(135deg, rgba(16, 185, 130, 0.4) 0%, rgba(147, 197, 253, 0.4) 100%)",
                        transform: activeCard === 5 ? `translateX(${dragOffset}px)` : undefined,
                        transition: isDragging ? "none" : "transform 0.3s ease-out",
                      }}
                    >
                      <div className="flex flex-col h-full text-white">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="card-icon-badge">
                              <span className="text-2xl">📊</span>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-wide opacity-90">Feature 5</span>
                              <h3 className="text-2xl font-bold">Practice Analytics</h3>
                            </div>
                          </div>
                          <button
                            className="card-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                            aria-label="Menu"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                            </svg>
                          </button>
                        </div>

                        <p className="text-lg opacity-90 mb-6 flex-1">
                          Track your spiritual growth with practice time monitoring, song mastery progress, and
                          devotional engagement metrics.
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="card-stat-row">
                            <span className="opacity-80">Practice Time</span>
                            <span className="font-semibold">Coming Soon</span>
                          </div>
                          <div className="card-stat-row">
                            <span className="opacity-80">Song Mastery</span>
                            <span className="font-semibold">Track Progress</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button className="studio-button primary flex-1" disabled>
                            View Analytics →
                          </button>
                          <button
                            className="studio-button secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSection("dashboard")
                            }}
                          >
                            Menu
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto py-12">
              <RecentlyPlayed />
            </div>
          </>
        )}
        {activeSection === "settings" && <Settings theme={resolvedTheme} setTheme={setTheme} />}
        {activeSection === "handpan" && <InteractiveHandpan />}
        {activeSection === "songs" && (
          <div className="min-h-screen">
            <SongLibrary />
          </div>
        )}
        {activeSection === "devotions" && <Devotions />}
        {activeSection === "export" && <ExportProgress />}
      </div>
      <PWAManager />
      <MobileNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
    </main>
  )
}
