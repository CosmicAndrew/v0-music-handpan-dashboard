"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { InteractiveHandpan } from "@/components/interactive-handpan"
import { SongLibrary } from "@/components/song-library"
import { Devotions } from "@/components/devotions"
import { ExportProgress } from "@/components/export-progress"
import { RecentlyPlayed } from "@/components/recently-played"
import { Settings } from "@/components/settings"
import { OfflineIndicator } from "@/components/offline-indicator"
import { useTheme } from "@/hooks/use-theme"
import { useGestures, usePullToRefresh } from "@/hooks/use-gestures"
import { cacheManager } from "@/lib/cache-manager"
import { expandedSongLibrary } from "@/lib/handpan-data"
import { Music2, BookOpen, Settings as SettingsIcon, ExternalLink as Download } from "@/components/icons"

type Section = "dashboard" | "handpan" | "songs" | "devotions" | "settings" | "export"

export default function HandpanWorshipStudio() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [activeCard, setActiveCard] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartTime, setDragStartTime] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preloadCache = async () => {
      try {
        await cacheManager.preloadSongLibrary(expandedSongLibrary)
      } catch (error) {
        // Silent fail for production
      }
    }

    preloadCache()
  }, [])

  const { isPulling, pullDistance } = usePullToRefresh(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  useGestures(
    containerRef,
    {
      onSwipeLeft: () => {
        if (activeSection === "dashboard") {
          const sections: Section[] = ["dashboard", "handpan", "songs", "devotions", "settings", "export"]
          const currentIndex = sections.indexOf(activeSection)
          if (currentIndex < sections.length - 1) {
            setActiveSection(sections[currentIndex + 1])
          }
        }
      },
      onSwipeRight: () => {
        if (activeSection !== "dashboard") {
          const sections: Section[] = ["dashboard", "handpan", "songs", "devotions", "settings", "export"]
          const currentIndex = sections.indexOf(activeSection)
          if (currentIndex > 0) {
            setActiveSection(sections[currentIndex - 1])
          }
        }
      },
    },
    {
      swipeThreshold: 75,
      preventScroll: false,
    },
  )

  useEffect(() => {
    if (activeSection === "dashboard" && !isDragging) {
      const timer = setInterval(() => {
        setActiveCard((current) => (current === 5 ? 1 : current + 1))
      }, 8000)
      return () => clearInterval(timer)
    }
  }, [activeSection, isDragging])

  const handleDragStart = useCallback((clientX: number, e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement

    // Check if clicking on interactive elements
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[data-interactive]") ||
      target.hasAttribute("data-interactive")
    ) {
      return false
    }

    setIsDragging(true)
    setDragStartX(clientX)
    setDragStartTime(Date.now())
    setDragOffset(0)
    return true
  }, [])

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return

      const offset = clientX - dragStartX
      // Only update if moved more than 5px for better performance
      if (Math.abs(offset) > 5) {
        setDragOffset(offset)
      }
    },
    [isDragging, dragStartX],
  )

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return

    const dragDuration = Date.now() - dragStartTime
    const velocity = Math.abs(dragOffset) / Math.max(dragDuration, 1)
    const threshold = velocity > 0.5 ? 50 : 100

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0 && activeCard < 5) {
        setActiveCard(activeCard + 1)
        if (navigator.vibrate) navigator.vibrate(10)
      } else if (dragOffset > 0 && activeCard > 1) {
        setActiveCard(activeCard - 1)
        if (navigator.vibrate) navigator.vibrate(10)
      }
    }

    setIsDragging(false)
    setDragOffset(0)
  }, [isDragging, dragOffset, dragStartTime, activeCard])

  const handleButtonClick = useCallback(
    (section: Section, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      console.log("[v0] 🔄 Navigation triggered")
      console.log("[v0] Current section:", activeSection)
      console.log("[v0] Target section:", section)

      setActiveSection(section)

      console.log("[v0] ✅ Navigation complete to:", section)
      if (navigator.vibrate) navigator.vibrate(10)
    },
    [activeSection],
  )

  const cardData = useMemo(
    () => [
      {
        id: 1,
        icon: "🎵",
        title: "Perfect Match Songs",
        description:
          "27 premium worship songs perfectly compatible with YataoPan D Kurd 10 in F & Dm keys. Includes Way Maker, Goodness of God, Build My Life, and more.",
        stats: [
          { label: "Total Songs", value: "27 tracks" },
          { label: "Compatibility", value: "Perfect Match" },
        ],
        primaryButton: { label: "Explore Library →", section: "songs" as Section },
        gradient: "linear-gradient(135deg, rgba(147, 197, 253, 0.4) 0%, rgba(196, 181, 253, 0.4) 100%)",
      },
      {
        id: 2,
        icon: "🪘",
        title: "Interactive Handpan",
        description:
          "Practice with authentic YataoPan D Kurd 10 sounds tuned to sacred 432Hz frequency. Includes patterns, chords, and meditation modes.",
        stats: [
          { label: "Tuning", value: "432Hz Sacred" },
          { label: "Notes", value: "10 (D Kurd)" },
        ],
        primaryButton: { label: "Play Handpan →", section: "handpan" as Section },
        gradient: "linear-gradient(135deg, rgba(140, 92, 246, 0.4) 0%, rgba(228, 72, 153, 0.4) 100%)",
      },
      {
        id: 3,
        icon: "✞",
        title: "Righteousness Devotions",
        description:
          "Biblical meditation on Blood Covenant, Cross Victory, and Gospel Foundation with handpan accompaniment for spiritual growth.",
        stats: [
          { label: "Devotions", value: "3 meditations" },
          { label: "Theme", value: "Righteousness" },
        ],
        primaryButton: { label: "Read Devotions →", section: "devotions" as Section },
        gradient: "linear-gradient(135deg, rgba(228, 72, 153, 0.4) 0%, rgba(245, 158, 11, 0.4) 100%)",
      },
      {
        id: 4,
        icon: "🎯",
        title: "Extended Practice",
        description:
          "Expand your repertoire with 13 additional songs in C & Bb keys. Strong and creative matches for advanced worship practice.",
        stats: [
          { label: "Additional Songs", value: "13 tracks" },
          { label: "Keys", value: "C & Bb" },
        ],
        primaryButton: { label: "View All Songs →", section: "songs" as Section },
        gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(16, 185, 130, 0.4) 100%)",
      },
      {
        id: 5,
        icon: "📊",
        title: "Practice Analytics",
        description:
          "Track your spiritual growth with practice time monitoring, song mastery progress, and devotional engagement metrics.",
        stats: [
          { label: "Practice Time", value: "Coming Soon" },
          { label: "Song Mastery", value: "Track Progress" },
        ],
        primaryButton: { label: "View Analytics →", section: "dashboard" as Section, disabled: true },
        gradient: "linear-gradient(135deg, rgba(16, 185, 130, 0.4) 0%, rgba(147, 197, 253, 0.4) 100%)",
      },
    ],
    [],
  )

  return (
    <main
      ref={containerRef}
      className="app-container min-h-screen relative overflow-hidden pb-24 md:pb-0"
      data-theme={resolvedTheme}
    >
      <OfflineIndicator />

      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-transform duration-200"
          style={{ transform: `translateY(${Math.min(pullDistance - 60, 20)}px)` }}
        >
          <div className="glass-surface-frosty px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white font-semibold text-sm">
                {pullDistance > 60 ? "Release to refresh" : "Pull to refresh"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="spline-container absolute top-0 left-0 w-full h-full -z-10 opacity-60 md:opacity-100">
        <iframe
          src="https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          title="3D Background"
          loading="lazy"
        />
      </div>

      <header className="pastel-glass-header sticky top-0 z-50 border-b border-white/20 hidden md:block desktop-only">
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
                onClick={() => handleButtonClick("dashboard")}
              >
                <span className="nav-icon">🎴</span>
                <span className="nav-label hidden sm:inline">Dashboard</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => handleButtonClick("settings")}
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-label hidden sm:inline">Settings</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "handpan" ? "active" : ""}`}
                onClick={() => handleButtonClick("handpan")}
              >
                <span className="nav-icon">🪘</span>
                <span className="nav-label hidden sm:inline">Handpan</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "songs" ? "active" : ""}`}
                onClick={() => handleButtonClick("songs")}
              >
                <span className="nav-icon">🎵</span>
                <span className="nav-label hidden sm:inline">Library</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "devotions" ? "active" : ""}`}
                onClick={() => handleButtonClick("devotions")}
              >
                <span className="nav-icon">✞</span>
                <span className="nav-label hidden sm:inline">Devotions</span>
              </button>
              <button
                className={`pastel-nav-item ${activeSection === "export" ? "active" : ""}`}
                onClick={() => handleButtonClick("export")}
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

      <div className="main-content pt-4 md:pt-6 lg:pt-8 px-3 md:px-6 lg:px-8 pb-6 md:pb-8">
        {activeSection === "dashboard" && (
          <div className="section-card-3d">
            <div className="min-h-[60vh] md:min-h-[70vh] flex items-center justify-center py-6 md:py-8">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center w-full">
                <div className="space-y-4 md:space-y-6 lg:space-y-8 fade-up">
                  <div className="space-y-3 md:space-y-4">
                    <div className="pastel-badge inline-flex">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-xs md:text-sm font-medium text-white uppercase tracking-wide">
                        Worship Platform
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight">
                      Transform Your
                      <span className="block text-white">Worship Experience</span>
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed">
                      Sacred 432Hz handpan with 40+ worship songs, biblical devotions, and interactive practice tools.
                      Drag through features to discover your spiritual journey.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setActiveCard(num)
                        }}
                        className={`mobile-touch-target transition-all ${
                          activeCard === num
                            ? "w-8 md:w-10 h-3 md:h-4 bg-white rounded-full"
                            : "w-3 md:w-4 h-3 md:h-4 bg-white/40 hover:bg-white/60 rounded-full"
                        }`}
                        aria-label={`Go to card ${num}`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full shrink-0" />
                      <span className="text-white text-sm md:text-base">27 Perfect Match songs in F & Dm keys</span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full shrink-0" />
                      <span className="text-white text-sm md:text-base">
                        Interactive handpan with authentic 432Hz tuning
                      </span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full shrink-0" />
                      <span className="text-white text-sm md:text-base">
                        Righteousness devotions with biblical meditation
                      </span>
                    </div>
                    <div className="feature-list-item">
                      <div className="w-2 h-2 bg-white rounded-full shrink-0" />
                      <span className="text-white text-sm md:text-base">Practice analytics and progress tracking</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <div
                    ref={cardsRef}
                    className={`worship-cards-section feature-${activeCard}-active ${isDragging ? "dragging" : ""}`}
                    style={{
                      height: "18rem",
                      cursor: isDragging ? "grabbing" : "grab",
                      touchAction: "pan-y",
                      userSelect: "none",
                    }}
                    onMouseDown={(e) => handleDragStart(e.clientX, e)}
                    onMouseMove={(e) => handleDragMove(e.clientX)}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e)}
                    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={handleDragEnd}
                  >
                    {cardData.map((card, index) => (
                      <div
                        key={card.id}
                        className="worship-feature-card pastel-card"
                        style={{
                          height: "18rem",
                          background: card.gradient,
                          transform:
                            activeCard === card.id
                              ? `translateX(${dragOffset}px) ${Math.abs(dragOffset) > 50 ? `rotateY(${dragOffset * 0.02}deg)` : ""}`
                              : undefined,
                          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          pointerEvents: activeCard === card.id ? "auto" : "none",
                        }}
                      >
                        <div className="flex flex-col h-full text-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="card-icon-badge">
                                <span className="text-2xl">{card.icon}</span>
                              </div>
                              <div>
                                <span className="text-xs uppercase tracking-wide opacity-90">Feature {card.id}</span>
                                <h3 className="text-xl font-bold">{card.title}</h3>
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

                          <p className="text-base opacity-90 mb-4 flex-1 line-clamp-3">{card.description}</p>

                          <div className="space-y-2 mb-4">
                            {card.stats.map((stat, i) => (
                              <div key={i} className="card-stat-row text-sm">
                                <span className="opacity-80">{stat.label}</span>
                                <span className="font-semibold">{stat.value}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <button
                              data-interactive="true"
                              className="studio-button primary flex-1 mobile-touch-target text-sm py-2"
                              onClick={(e) => handleButtonClick(card.primaryButton.section, e)}
                              onTouchEnd={(e) => {
                                e.stopPropagation()
                                handleButtonClick(card.primaryButton.section)
                              }}
                              disabled={card.primaryButton.disabled}
                            >
                              {card.primaryButton.label}
                            </button>
                            <button
                              data-interactive="true"
                              className="studio-button secondary mobile-touch-target text-sm py-2"
                              onClick={(e) => handleButtonClick("dashboard", e)}
                              onTouchEnd={(e) => {
                                e.stopPropagation()
                                handleButtonClick("dashboard")
                              }}
                            >
                              Menu
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 md:py-12">
              <RecentlyPlayed />
            </div>
          </div>
        )}
        {activeSection === "settings" && (
          <div className="section-card-3d">
            <Settings theme={theme} setTheme={setTheme} />
          </div>
        )}
        {activeSection === "handpan" && (
          <div className="section-card-3d">
            <InteractiveHandpan />
          </div>
        )}
        {activeSection === "songs" && (
          <div className="section-card-3d min-h-screen">
            <SongLibrary />
          </div>
        )}
        {activeSection === "devotions" && (
          <div className="section-card-3d">
            <Devotions />
          </div>
        )}
        {activeSection === "export" && (
          <div className="section-card-3d">
            <ExportProgress />
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-surface-frosty border-t-2 border-white/30 backdrop-blur-xl">
          <div className="flex items-center justify-around px-1 py-2">
            <button
              onClick={() => handleButtonClick("dashboard")}
              className={`mobile-nav-btn ${
                activeSection === "dashboard"
                  ? "bg-white/30 text-white scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-xs font-semibold">Home</span>
            </button>

            <button
              onClick={() => handleButtonClick("handpan")}
              className={`mobile-nav-btn ${
                activeSection === "handpan"
                  ? "bg-white/30 text-white scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Music2 className="mobile-nav-icon" />
              <span className="text-xs font-semibold">Play</span>
            </button>

            <button
              onClick={() => handleButtonClick("songs")}
              className={`mobile-nav-btn ${
                activeSection === "songs"
                  ? "bg-white/30 text-white scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Music2 className="mobile-nav-icon" />
              <span className="text-xs font-semibold">Library</span>
            </button>

            <button
              onClick={() => handleButtonClick("devotions")}
              className={`mobile-nav-btn ${
                activeSection === "devotions"
                  ? "bg-white/30 text-white scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <BookOpen className="mobile-nav-icon" />
              <span className="text-xs font-semibold">Devotions</span>
            </button>

            <button
              onClick={() => handleButtonClick("export")}
              className={`mobile-nav-btn ${
                activeSection === "export"
                  ? "bg-white/30 text-white scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Download className="mobile-nav-icon" />
              <span className="text-xs font-semibold">Export</span>
            </button>

            <button
              onClick={() => handleButtonClick("settings")}
              className={`mobile-nav-btn ${
                activeSection === "settings"
                  ? "bg-white/30 text-white scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <SettingsIcon className="mobile-nav-icon" />
              <span className="text-xs font-semibold">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </main>
  )
}
