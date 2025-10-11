"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Clock, Music2 } from "@/components/icons"

interface RecentSong {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  playedAt: string
  coverColor: string
  compatibility: "perfect" | "strong" | "creative"
}

const recentlyPlayedSongs: RecentSong[] = [
  {
    id: 1,
    title: "Way Maker",
    artist: "Sinach",
    album: "Way Maker",
    duration: "5:32",
    playedAt: "2 hours ago",
    coverColor: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    compatibility: "perfect",
  },
  {
    id: 2,
    title: "Goodness of God",
    artist: "Bethel Music",
    album: "Victory",
    duration: "6:31",
    playedAt: "5 hours ago",
    coverColor: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    compatibility: "perfect",
  },
  {
    id: 3,
    title: "Build My Life",
    artist: "Passion",
    album: "Follow You Anywhere",
    duration: "4:18",
    playedAt: "Yesterday",
    coverColor: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)",
    compatibility: "perfect",
  },
  {
    id: 4,
    title: "Graves Into Gardens",
    artist: "Elevation Worship",
    album: "Graves Into Gardens",
    duration: "6:45",
    playedAt: "Yesterday",
    coverColor: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
    compatibility: "strong",
  },
  {
    id: 5,
    title: "Reckless Love",
    artist: "Cory Asbury",
    album: "Reckless Love",
    duration: "5:19",
    playedAt: "2 days ago",
    coverColor: "linear-gradient(135deg, #10b981 0%, #6366f1 100%)",
    compatibility: "perfect",
  },
  {
    id: 6,
    title: "What A Beautiful Name",
    artist: "Hillsong Worship",
    album: "Let There Be Light",
    duration: "4:18",
    playedAt: "2 days ago",
    coverColor: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
    compatibility: "perfect",
  },
]

export function RecentlyPlayed() {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      const containerWidth = scrollContainerRef.current.clientWidth
      const songWidth = 336 // Width of each song card including gap
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / songWidth)
      setCurrentIndex(newIndex)
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 fade-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center animate-pulse-glow">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Recently Played</h1>
              <p className="text-lg text-white/90 mt-1">Your worship journey continues</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="glass-card rounded-2xl p-6 mt-6 text-transparent">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 transition-transform duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{recentlyPlayedSongs.length}</p>
                  <p className="text-sm text-white/80">Songs Played</p>
                </div>
              </div>
              <div className="flex items-center gap-4 transition-transform duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {recentlyPlayedSongs.filter((s) => s.compatibility === "perfect").length}
                  </p>
                  <p className="text-sm text-white/80">Perfect Matches</p>
                </div>
              </div>
              <div className="flex items-center gap-4 transition-transform duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl">🪘</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">432Hz</p>
                  <p className="text-sm text-white/80">Sacred Tuning</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Played List */}
        <div className="relative mb-8">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing text-transparent"
            style={{
              scrollBehavior: isDragging ? "auto" : "smooth",
              userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {recentlyPlayedSongs.map((song, index) => (
              <div
                key={song.id}
                className="song-card group flex-shrink-0 w-80 snap-center"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setHoveredId(song.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-center gap-4">
                  {/* Album Art */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                      style={{ background: song.coverColor }}
                    />
                    <button
                      onClick={() => togglePlay(song.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label={playingId === song.id ? "Pause" : "Play"}
                    >
                      {playingId === song.id ? (
                        <Pause className="w-8 h-8 text-white fill-white animate-ripple" />
                      ) : (
                        <Play className="w-8 h-8 text-white fill-white" />
                      )}
                    </button>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-sm text-white/80 truncate">{song.artist}</p>
                    <p className="text-xs text-white/60 mt-1">{song.album}</p>
                  </div>
                </div>

                {/* Compatibility Badge */}
                <div className="mt-4">
                  <span
                    className={`compatibility-badge ${
                      song.compatibility === "perfect"
                        ? "tier-perfect"
                        : song.compatibility === "strong"
                          ? "tier-strong"
                          : "tier-creative"
                    }`}
                  >
                    {song.compatibility === "perfect" && "Perfect Match"}
                    {song.compatibility === "strong" && "Strong Match"}
                    {song.compatibility === "creative" && "Creative Match"}
                  </span>
                </div>

                {/* Duration & Time */}
                <div className="flex items-center justify-between mt-4 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{song.playedAt}</span>
                  </div>
                  <span className="font-medium">{song.duration}</span>
                </div>

                {/* Playing Indicator */}
                {playingId === song.id && (
                  <div className="flex items-center gap-1 mt-4 justify-center">
                    <div
                      className="w-1 h-4 bg-indigo-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0s" }}
                    />
                    <div
                      className="w-1 h-6 bg-indigo-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-1 h-5 bg-indigo-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                )}

                {/* Progress Bar (shown when playing) */}
                {playingId === song.id && (
                  <div className="mt-4 progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "45%" }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Swipe Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {recentlyPlayedSongs.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: index * 336,
                      behavior: "smooth",
                    })
                  }
                }}
                className={`transition-all ${
                  currentIndex === index
                    ? "w-8 h-3 bg-white rounded-full"
                    : "w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full"
                }`}
                aria-label={`Go to song ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Empty State (if no songs) */}
        {recentlyPlayedSongs.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Music2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Recent Plays</h3>
            <p className="text-white/80 mb-6">Start your worship journey by playing a song from the library</p>
            <button className="studio-button primary">Browse Library</button>
          </div>
        )}
      </div>
    </div>
  )
}
