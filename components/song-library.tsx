"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music2, Play, ExternalLink, Search, X } from "@/components/icons"
import { expandedSongLibrary, type Song } from "@/lib/handpan-data"

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "YouTube") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          fill="#ff0000"
          d="M23.5 6.2c-.3-1.2-1.2-2.1-2.4-2.4C19.1 3.5 12 3.5 12 3.5s-7.1 0-9.1.3c-1.2.3-2.1 1.2-2.4 2.4C.2 8.2.2 12.1.2 12.1s0 3.9.3 5.9c.3 1.2 1.2 2.1 2.4 2.4.3-2 .3-5.9.3-5.9s0-3.9-.3-5.9z"
        />
        <path fill="#fff" d="M9.7 15.5l6.1-3.4-6.1-3.4v6.8z" />
      </svg>
    )
  }
  if (platform === "Vimeo") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          fill="#1ab7ea"
          d="M23.9 6.4c-.1 2.4-1.8 5.7-5.1 9.9-3.4 4.4-6.3 6.6-8.7 6.6-1.5 0-2.7-1.4-3.8-4.1L4.6 13c-.7-2.8-1.5-4.1-2.4-4.1-.2 0-.9.4-2.2 1.3L0 8.8c1.4-1.2 2.7-2.4 4-3.6 1.8-1.5 3.1-2.3 4-2.4 2.1-.2 3.4 1.2 3.9 4.2.5 3.2.9 5.2 1 6 .5 2.3 1.1 3.4 1.8 3.4.5 0 1.3-.8 2.3-2.4 1-1.6 1.5-2.8 1.6-3.6.2-1.3-.4-2-1.6-2-.6 0-1.2.1-1.8.4 1.2-3.9 3.5-5.8 6.9-5.7 2.5.1 3.7 1.7 3.6 4.8z"
        />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        fill="#6366f1"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  )
}

const getPopularityColor = (popularity: string) => {
  switch (popularity) {
    case "Very High":
      return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
    case "High":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
    case "Medium":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30"
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30"
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "Perfect":
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
    case "Strong":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
    case "Creative":
      return "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30"
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30"
  }
}

export function SongLibrary() {
  const [tierFilter, setTierFilter] = useState<string>("")
  const [keyFilter, setKeyFilter] = useState<string>("")
  const [popularityFilter, setPopularityFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const getTierCount = (tier: string) => expandedSongLibrary.filter((song) => song.tier === tier).length
  const getKeyCount = (key: string) => expandedSongLibrary.filter((song) => song.key === key).length

  const filteredSongs = useMemo(() => {
    return expandedSongLibrary.filter((song) => {
      const matchesTier = !tierFilter || song.tier === tierFilter
      const matchesKey = !keyFilter || song.key === keyFilter
      const matchesPopularity = !popularityFilter || song.popularity === popularityFilter
      const matchesSearch =
        !searchQuery ||
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTier && matchesKey && matchesPopularity && matchesSearch
    })
  }, [tierFilter, keyFilter, popularityFilter, searchQuery])

  const clearAllFilters = () => {
    setTierFilter("")
    setKeyFilter("")
    setPopularityFilter("")
    setSearchQuery("")
  }

  const startHandpanPractice = (song: Song) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 🎵 LIBRARY: Practice button clicked!")
      console.log("[v0] Song title:", song.title)
      console.log("[v0] Song artist:", song.artist)
      console.log("[v0] Song chords:", song.chords)
      console.log("[v0] Song key:", song.key)
      console.log("[v0] Song tier:", song.tier)
    }

    localStorage.setItem(
      "currentSong",
      JSON.stringify({
        title: song.title,
        artist: song.artist,
        chords: song.chords,
        key: song.key,
        tier: song.tier,
      }),
    )

    if (process.env.NODE_ENV === "development") {
      console.log("[v0] ✅ LIBRARY: Song data stored in localStorage")
      console.log("[v0] 🎹 LIBRARY: This should navigate to Handpan section")
    }

    const songsPlayed = Number.parseInt(localStorage.getItem("songsPlayed") || "0") + 1
    localStorage.setItem("songsPlayed", songsPlayed.toString())

    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 📊 LIBRARY: Updated songs played count:", songsPlayed)
    }
  }

  const handleChordClick = (chord: string, songTitle: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 🎼 LIBRARY: Chord clicked!")
      console.log("[v0] Chord:", chord)
      console.log("[v0] From song:", songTitle)
      console.log("[v0] This chord should be highlighted in the handpan view")
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 🔍 LIBRARY: Search input changed:", value)
      console.log("[v0] ✅ LIBRARY: Filtered results count:", filteredSongs.length)
    }
  }

  const handleTierFilter = (tier: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 🎯 LIBRARY: Tier filter clicked:", tier)
    }
    setTierFilter(tier)
  }

  const handleKeyFilter = (key: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 🎹 LIBRARY: Key filter clicked:", key)
    }
    setKeyFilter(key)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <iframe
          src="https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          className="w-full h-full"
        />
      </div>

      <div className="space-y-4 md:space-y-6 relative z-10">
        <div className="glass-surface-frosty p-4 md:p-6 lg:p-8 rounded-2xl space-y-3 md:space-y-4 border-2 border-white/30">
          <div>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
              style={{
                textShadow: "0 3px 10px rgba(0, 0, 0, 0.8), 0 6px 20px rgba(0, 0, 0, 0.6)",
              }}
            >
              Worship Component Gallery
            </h1>
            <p
              className="text-white text-sm md:text-base lg:text-lg"
              style={{
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.7), 0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
            >
              Professional handpan components for your worship experience
            </p>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <div className="stat-badge-enhanced">
              <span className="font-bold text-base md:text-lg">{expandedSongLibrary.length}</span>{" "}
              <span className="hidden sm:inline">Components</span>
            </div>
            <div className="stat-badge-enhanced">
              <span className="font-bold text-base md:text-lg">432Hz</span>{" "}
              <span className="hidden sm:inline">Tuned</span>
            </div>
            <div className="stat-badge-enhanced">
              <span className="font-bold text-base md:text-lg">D Kurd</span>{" "}
              <span className="hidden sm:inline">Scale</span>
            </div>
            <div className="stat-badge-enhanced">
              <span className="font-bold text-base md:text-lg">{getTierCount("Perfect")}</span>{" "}
              <span className="hidden sm:inline">Perfect</span>
            </div>
          </div>
        </div>

        <Card className="glass-surface-frosty p-4 md:p-6 space-y-3 md:space-y-4 border-2 border-white/30">
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2 md:space-y-3">
              <label
                className="text-sm md:text-base font-bold text-white block bg-black/30 px-3 py-2 rounded-lg"
                style={{
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
                }}
              >
                Compatibility Tier
              </label>
              <div className="flex gap-2 flex-wrap md:flex-nowrap overflow-x-auto mobile-tabs pb-2">
                <button
                  onClick={() => handleTierFilter("")}
                  className={`filter-btn-enhanced ${!tierFilter ? "active" : ""}`}
                >
                  All Tiers
                </button>
                <button
                  onClick={() => handleTierFilter("Perfect")}
                  className={`filter-btn-enhanced ${tierFilter === "Perfect" ? "active" : ""}`}
                >
                  Perfect Match ({getTierCount("Perfect")})
                </button>
                <button
                  onClick={() => handleTierFilter("Strong")}
                  className={`filter-btn-enhanced ${tierFilter === "Strong" ? "active" : ""}`}
                >
                  Strong Match ({getTierCount("Strong")})
                </button>
                <button
                  onClick={() => handleTierFilter("Creative")}
                  className={`filter-btn-enhanced ${tierFilter === "Creative" ? "active" : ""}`}
                >
                  Creative Match ({getTierCount("Creative")})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label
                className="text-sm md:text-base font-bold text-white block bg-black/30 px-3 py-2 rounded-lg"
                style={{
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
                }}
              >
                Key Signature
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleKeyFilter("")}
                  className={`filter-btn-enhanced ${!keyFilter ? "active" : ""}`}
                >
                  All Keys
                </button>
                <button
                  onClick={() => handleKeyFilter("F")}
                  className={`filter-btn-enhanced ${keyFilter === "F" ? "active" : ""}`}
                >
                  Key: F ({getKeyCount("F")})
                </button>
                <button
                  onClick={() => handleKeyFilter("Dm")}
                  className={`filter-btn-enhanced ${keyFilter === "Dm" ? "active" : ""}`}
                >
                  Key: Dm ({getKeyCount("Dm")})
                </button>
                <button
                  onClick={() => handleKeyFilter("C")}
                  className={`filter-btn-enhanced ${keyFilter === "C" ? "active" : ""}`}
                >
                  Key: C ({getKeyCount("C")})
                </button>
                <button
                  onClick={() => handleKeyFilter("Bb")}
                  className={`filter-btn-enhanced ${keyFilter === "Bb" ? "active" : ""}`}
                >
                  Key: Bb ({getKeyCount("Bb")})
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 md:pl-10 h-12 md:h-14 mobile-search-input bg-white/95 text-gray-900 font-medium border-2 border-white/40 placeholder:text-gray-600 text-sm md:text-base"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
            {(tierFilter || keyFilter || popularityFilter || searchQuery) && (
              <Button
                onClick={() => {
                  if (process.env.NODE_ENV === "development") {
                    console.log("[v0] ❌ LIBRARY: Clear filters button clicked")
                  }
                  clearAllFilters()
                }}
                variant="outline"
                size="icon"
                className="h-12 w-12 md:h-14 md:w-14 mobile-touch-target bg-white/95 border-2 border-white/40"
              >
                <X className="w-5 h-5 text-gray-900" />
              </Button>
            )}
          </div>

          <div
            className="text-sm font-semibold text-white bg-black/30 px-4 py-2 rounded-lg"
            style={{
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
            }}
          >
            Showing <span className="font-bold text-lg">{filteredSongs.length}</span> of{" "}
            <span className="font-bold text-lg">{expandedSongLibrary.length}</span> components
          </div>
        </Card>

        <div className="grid gap-4 md:gap-6">
          {filteredSongs.map((song) => (
            <Card
              key={`${song.title}-${song.artist}`}
              className="glass-surface-frosty overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-white/30"
            >
              <div className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4">
                <div className="flex items-start gap-4">
                  <div className="component-preview-icon-enhanced">
                    <Music2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <a
                      href={song.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 hover:opacity-80 transition-opacity"
                    >
                      <h3
                        className="text-2xl md:text-3xl font-bold group-hover:underline flex-1 text-white"
                        style={{
                          textShadow: "0 3px 10px rgba(0, 0, 0, 0.8), 0 6px 20px rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        {song.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <PlatformIcon platform={song.platform} />
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </a>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p
                        className="text-white text-lg font-medium"
                        style={{
                          textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        {song.artist}
                      </p>
                      <Badge className={`${getPopularityColor(song.popularity)} font-bold text-sm px-3 py-1`}>
                        {song.popularity}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg">
                    <p
                      className="text-xs font-bold text-white"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      Key
                    </p>
                    <Badge
                      variant="outline"
                      className="font-mono font-bold text-base border-2 border-white/40 bg-white/90 text-gray-900"
                    >
                      {song.key}
                    </Badge>
                  </div>
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg">
                    <p
                      className="text-xs font-bold text-white"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      Tier
                    </p>
                    <Badge className={`${getTierColor(song.tier)} font-bold text-sm`}>{song.tier}</Badge>
                  </div>
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg">
                    <p
                      className="text-xs font-bold text-white"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      Duration
                    </p>
                    <p
                      className="text-base font-bold text-white"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      {song.duration}
                    </p>
                  </div>
                  {song.ministry !== "General" && (
                    <div className="space-y-1 bg-black/20 p-3 rounded-lg">
                      <p
                        className="text-xs font-bold text-white"
                        style={{
                          textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        Focus
                      </p>
                      <Badge variant="secondary" className="text-xs font-bold">
                        {song.ministry === "Lifestyle Christianity" ? "LC" : song.ministry}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-3 bg-black/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music2 className="w-5 h-5 text-white" />
                      <span
                        className="text-base font-bold text-white"
                        style={{
                          textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        Handpan Chords
                      </span>
                    </div>
                    <span
                      className="text-sm font-bold text-white bg-black/30 px-3 py-1 rounded"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      {song.chords.length} chords
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {song.chords.map((chord, idx) => (
                      <div
                        key={idx}
                        className="px-5 py-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 font-mono font-bold text-base md:text-lg hover:scale-105 transition-transform cursor-pointer border-2 border-amber-300/50 shadow-lg"
                        onClick={() => handleChordClick(chord, song.title)}
                      >
                        {chord}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                  <Button
                    onClick={() => startHandpanPractice(song)}
                    className="flex-1 gap-2 action-btn-primary h-12 md:h-14 text-sm md:text-base font-bold"
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Preview Component</span>
                    <span className="sm:hidden">Preview</span>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 gap-2 action-btn-secondary bg-white/95 h-12 md:h-14 text-sm md:text-base font-bold border-2 border-white/40"
                  >
                    <a
                      href={song.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (process.env.NODE_ENV === "development") {
                          console.log("[v0] 🔗 LIBRARY: External link clicked for:", song.title)
                          console.log("[v0] Opening video URL:", song.videoUrl)
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline">Add to Setlist</span>
                      <span className="sm:hidden">Add</span>
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <Card className="glass-surface-frosty p-12 text-center border-2 border-white/30">
            <p
              className="text-white text-lg font-semibold"
              style={{
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
              }}
            >
              No components match your filters. Try adjusting your search criteria.
            </p>
            <Button
              onClick={clearAllFilters}
              variant="outline"
              className="mt-4 bg-white/95 font-bold border-2 border-white/40"
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
