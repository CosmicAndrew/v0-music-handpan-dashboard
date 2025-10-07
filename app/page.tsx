"use client"

import type React from "react"
import { useState, useEffect, lazy, Suspense } from "react"
import { useTheme } from "@/hooks/use-theme"

const InteractiveHandpan = lazy(() => import("@/components/interactive-handpan").then(mod => ({ default: mod.InteractiveHandpan })))
const SongLibrary = lazy(() => import("@/components/song-library").then(mod => ({ default: mod.SongLibrary })))
const Devotions = lazy(() => import("@/components/devotions").then(mod => ({ default: mod.Devotions })))
const ExportProgress = lazy(() => import("@/components/export-progress").then(mod => ({ default: mod.ExportProgress })))
const RecentlyPlayed = lazy(() => import("@/components/recently-played").then(mod => ({ default: mod.RecentlyPlayed })))
const Settings = lazy(() => import("@/components/settings").then(mod => ({ default: mod.Settings })))

type Section = "dashboard" | "handpan" | "songs" | "devotions" | "settings" | "export"

const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <p className="text-white/80 text-sm">Loading...</p>
    </div>
  </div>
)

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [activeCard, setActiveCard] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)

  useEffect(() => {
  }, [resolvedTheme])

  useEffect(() => {
    const timer = setTimeout(() => setBackgroundLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
        {backgroundLoaded && (
          <iframe
            src="https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY"
            frameBorder="0"
            width="100%"
            height="100%"
            id="aura-spline"
            title="3D Background"
            loading="lazy"
          />
        )}
      </div>

      <header className="pastel-glass-header sticky top-0 z-[100] border-b border-white/20 safe-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 safe-x">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12">
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
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">Handpan Worship Studio</h1>
                <span className="text-xs text-white/80">Design your worship experience</span>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide max-w-[calc(100vw-8rem)] sm:max-w-none">
              <button
                className={`pastel-nav-item ${activeSection === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveSection("dashboard")}
              >
                <span className="nav-icon text-xl sm:text-2xl">🎴</span>
                <span className="nav-label hidden md:inline">Dashboard</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "handpan" ? "active" : ""}`}
                onClick={() => setActiveSection("handpan")}
              >
                <span className="nav-icon text-xl sm:text-2xl">🪘</span>
                <span className="nav-label hidden md:inline">Handpan</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "songs" ? "active" : ""}`}
                onClick={() => setActiveSection("songs")}
              >
                <span className="nav-icon text-xl sm:text-2xl">🎵</span>
                <span className="nav-label hidden md:inline">Library</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "devotions" ? "active" : ""}`}
                onClick={() => setActiveSection("devotions")}
              >
                <span className="nav-icon text-xl sm:text-2xl">✞</span>
                <span className="nav-label hidden md:inline">Devotions</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => setActiveSection("settings")}
              >
                <span className="nav-icon text-xl sm:text-2xl">⚙️</span>
                <span className="nav-label hidden md:inline">Settings</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="main-content pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-8 safe-x safe-bottom">
        {activeSection === "dashboard" && (
          <>
            <div className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-4 sm:py-8">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 fade-up order-2 lg:order-1">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="pastel-badge inline-flex">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm font-medium text-white uppercase tracking-wide">Worship Platform</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                      Transform Your
                      <span className="block text-white">Worship Experience</span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed">
                      Sacred 432Hz handpan with 40+ worship songs, biblical devotions, and interactive practice tools.
                      <span className="hidden sm:inline"> Drag through features to discover your spiritual journey.</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setActiveCard(num)}
                        className={`transition-all touch-manipulation ${
                          activeCard === num
                            ? "w-10 h-4 sm:w-8 sm:h-3 bg-white rounded-full"
                            : "w-4 h-4 sm:w-3 sm:h-3 bg-white/40 hover:bg-white/60 rounded-full"
                        }`}
                        aria-label={`Go to card ${num}`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">27 Perfect Match songs in F & Dm keys</span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Interactive handpan with authentic 432Hz tuning</span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Righteousness devotions with biblical meditation</span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Practice analytics and progress tracking</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end order-1 lg:order-2 w-full max-w-md">
                  <div
                    className={`worship-cards-section feature-${activeCard}-active ${isDragging ? "dragging" : ""} w-full touch-manipulation`}
                    style={{ 
                      height: "clamp(20rem, 70vh, 28rem)",
                      cursor: isDragging ? "grabbing" : "grab",
                      touchAction: "manipulation"
                    }}
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
                        height: "28rem",
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
                        height: "28rem",
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
                        height: "28rem",
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
                        height: "28rem",
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
                        height: "28rem",
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
              <Suspense fallback={<ComponentLoader />}>
                <RecentlyPlayed />
              </Suspense>
            </div>
          </>
        )}
        {activeSection === "settings" && (
          <Suspense fallback={<ComponentLoader />}>
            <Settings theme={resolvedTheme} setTheme={setTheme} />
          </Suspense>
        )}
        {activeSection === "handpan" && (
          <Suspense fallback={<ComponentLoader />}>
            <InteractiveHandpan />
          </Suspense>
        )}
        {activeSection === "songs" && (
          <div className="min-h-screen">
            <Suspense fallback={<ComponentLoader />}>
              <SongLibrary />
            </Suspense>
          </div>
        )}
        {activeSection === "devotions" && (
          <Suspense fallback={<ComponentLoader />}>
            <Devotions />
          </Suspense>
        )}
        {activeSection === "export" && (
          <Suspense fallback={<ComponentLoader />}>
            <ExportProgress />
          </Suspense>
        )}
      </div>
    </main>
  )
}
