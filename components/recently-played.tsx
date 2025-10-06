"use client"

import { useState } from "react"
import { Play, Pause, Clock, Music2 } from "lucide-react"

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

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id)
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 fade-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Recently Played</h1>
              <p className="text-lg text-gray-600 mt-1">Your worship journey continues</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="glass-card rounded-2xl p-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{recentlyPlayedSongs.length}</p>
                  <p className="text-sm text-gray-600">Songs Played</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentlyPlayedSongs.filter((s) => s.compatibility === "perfect").length}
                  </p>
                  <p className="text-sm text-gray-600">Perfect Matches</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                  <span className="text-2xl">🪘</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">432Hz</p>
                  <p className="text-sm text-gray-600">Sacred Tuning</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Played List */}
        <div className="space-y-4">
          {recentlyPlayedSongs.map((song, index) => (
            <div
              key={song.id}
              className="song-card group"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
              onMouseEnter={() => setHoveredId(song.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center gap-6">
                {/* Album Art */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    style={{ background: song.coverColor }}
                  />
                  <button
                    onClick={() => togglePlay(song.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label={playingId === song.id ? "Pause" : "Play"}
                  >
                    {playingId === song.id ? (
                      <Pause className="w-8 h-8 text-white fill-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white fill-white" />
                    )}
                  </button>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{song.artist}</p>
                  <p className="text-xs text-gray-500 mt-1">{song.album}</p>
                </div>

                {/* Compatibility Badge */}
                <div className="hidden md:block">
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
                <div className="hidden lg:flex items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{song.playedAt}</span>
                  </div>
                  <span className="font-medium">{song.duration}</span>
                </div>

                {/* Playing Indicator */}
                {playingId === song.id && (
                  <div className="flex items-center gap-1">
                    <div
                      className="w-1 h-4 bg-indigo-600 rounded-full animate-pulse"
                      style={{ animationDelay: "0s" }}
                    />
                    <div
                      className="w-1 h-6 bg-indigo-600 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-1 h-5 bg-indigo-600 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                )}
              </div>

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

        {/* Empty State (if no songs) */}
        {recentlyPlayedSongs.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Music2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Recent Plays</h3>
            <p className="text-gray-600 mb-6">Start your worship journey by playing a song from the library</p>
            <button className="studio-button primary">Browse Library</button>
          </div>
        )}
      </div>
    </div>
  )
}
