"use client"

import { Music, Library, BookOpen, Play, Clock } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

type Section = "dashboard" | "handpan" | "songs" | "devotions"

interface DashboardProps {
  onNavigate: (section: Section) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const [stats, setStats] = useState({
    totalPracticeTime: 0,
    songsPlayed: 0,
    favoriteKey: "D Kurd",
    sessionsThisWeek: 0,
    practiceTimeThisWeek: 0,
    averageSessionTime: 0,
    recentSongs: [] as string[],
    achievements: 7,
    latestAchievement: "Perfect Chord Master",
    nextGoal: "Scale Virtuoso",
    weeklyGoalProgress: 75,
    skillLevelProgress: 70,
  })

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 📊 DASHBOARD: Loading user statistics")
    }

    const loadStats = () => {
      const practiceTime = Number.parseInt(localStorage.getItem("totalPracticeTime") || "0")
      const songsPlayed = Number.parseInt(localStorage.getItem("songsPlayed") || "0")
      const sessions = Number.parseInt(localStorage.getItem("sessionsThisWeek") || "0")
      const practiceThisWeek = Number.parseInt(localStorage.getItem("practiceTimeThisWeek") || "12")
      const recentSongsStr = localStorage.getItem("recentSongs") || "[]"
      const recentSongs = JSON.parse(recentSongsStr)

      const avgSession = sessions > 0 ? Math.round(practiceTime / sessions) : 0

      setStats({
        totalPracticeTime: practiceTime,
        songsPlayed: songsPlayed,
        favoriteKey: "D Kurd",
        sessionsThisWeek: sessions,
        practiceTimeThisWeek: practiceThisWeek,
        averageSessionTime: avgSession,
        recentSongs: recentSongs.slice(0, 3),
        achievements: 7,
        latestAchievement: "Perfect Chord Master",
        nextGoal: "Scale Virtuoso",
        weeklyGoalProgress: Math.min(100, Math.round((practiceTime / 60) * 100)),
        skillLevelProgress: Math.min(100, Math.round((songsPlayed / 10) * 100)),
      })

      if (process.env.NODE_ENV === "development") {
        console.log("[v0] ✅ DASHBOARD: Statistics loaded", {
          practiceTime,
          songsPlayed,
          sessions,
          avgSession,
        })
      }
    }
    loadStats()
  }, [])

  const handleCardClick = (cardType: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 📊 DASHBOARD CARD CLICKED:", cardType)
    }
    setExpandedCard(expandedCard === cardType ? null : cardType)
  }

  const handleStartPractice = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] ▶️ STARTING PRACTICE SESSION")
    }
    onNavigate("handpan")
  }

  const handleBrowseSongs = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 📚 OPENING LIBRARY")
    }
    onNavigate("songs")
  }

  const handleSetGoals = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] 🎯 OPENING GOAL SETTINGS")
    }
    // Future: Open goals modal
  }

  const featuredSongs = [
    {
      title: "Way Maker",
      artist: "Leeland",
      key: "F",
      tier: "Perfect Match",
    },
    {
      title: "Build My Life",
      artist: "Pat Barrett",
      key: "F",
      tier: "Perfect Match",
    },
    {
      title: "Goodness of God",
      artist: "Bethel Music",
      key: "Dm",
      tier: "Perfect Match",
    },
  ]

  const recentlyPlayed = [
    {
      id: 1,
      title: "How Great Is Our God",
      artist: "Chris Tomlin",
      duration: "4:32",
      playedAt: "2 hours ago",
      image: "/worship-album-cover.png",
    },
    {
      id: 2,
      title: "Oceans (Where Feet May Fail)",
      artist: "Hillsong UNITED",
      duration: "8:56",
      playedAt: "5 hours ago",
      image: "/ocean-worship-album.jpg",
    },
    {
      id: 3,
      title: "Goodness of God",
      artist: "Bethel Music",
      duration: "5:23",
      playedAt: "Yesterday",
      image: "/bethel-music-album.jpg",
    },
    {
      id: 4,
      title: "Way Maker",
      artist: "Sinach",
      duration: "5:45",
      playedAt: "Yesterday",
      image: "/way-maker-album-cover.jpg",
    },
  ]

  const handlePlayTrack = (track: (typeof recentlyPlayed)[0]) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] ▶️ DASHBOARD: Playing track", track.title)
    }

    const newSongsPlayed = stats.songsPlayed + 1
    setStats((prev) => ({ ...prev, songsPlayed: newSongsPlayed }))
    localStorage.setItem("songsPlayed", newSongsPlayed.toString())

    if (process.env.NODE_ENV === "development") {
      console.log("[v0] ✅ DASHBOARD: Statistics updated - Songs played:", newSongsPlayed)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 fade-up">
        <h1 className="text-4xl md:text-5xl font-bold text-balance">Welcome to Handpan Worship</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Experience worship through the harmonic resonance of the YataoPan D Kurd 10, tuned to 432 Hz
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 fade-up" style={{ animationDelay: "0.025s" }}>
        <button
          onClick={handleStartPractice}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-4 py-2 min-h-[44px] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <span>▶️</span>
          <span className="font-medium">Start Practice</span>
        </button>
        <button
          onClick={handleBrowseSongs}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-4 py-2 min-h-[44px] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <span>📚</span>
          <span className="font-medium">Browse Songs</span>
        </button>
        <button
          onClick={handleSetGoals}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-4 py-2 min-h-[44px] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <span>🎯</span>
          <span className="font-medium">Set Goals</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-up" style={{ animationDelay: "0.05s" }}>
        <div
          onClick={() => handleCardClick("practice")}
          className={`glass-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            expandedCard === "practice" ? "col-span-1 sm:col-span-2 lg:col-span-4" : ""
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">🕐 Practice Time</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {stats.totalPracticeTime} <span className="text-lg">min</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            {expandedCard === "practice" && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded">
                  <p className="text-sm opacity-80">This Week</p>
                  <p className="text-2xl font-bold">{stats.practiceTimeThisWeek} min</p>
                </div>
                <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded">
                  <p className="text-sm opacity-80">Sessions</p>
                  <p className="text-2xl font-bold">{stats.sessionsThisWeek}</p>
                </div>
                <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded">
                  <p className="text-sm opacity-80">Avg/Session</p>
                  <p className="text-2xl font-bold">{stats.averageSessionTime} min</p>
                </div>
              </div>
            )}
          </CardContent>
        </div>

        <div
          onClick={() => handleCardClick("songs")}
          className={`glass-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            expandedCard === "songs" ? "col-span-1 sm:col-span-2" : ""
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">🎵 Songs Played</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.songsPlayed}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            {expandedCard === "songs" && stats.recentSongs.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm opacity-80">Recent Favorites:</p>
                {stats.recentSongs.map((song, index) => (
                  <div key={index} className="bg-green-500/10 dark:bg-green-500/20 p-2 rounded text-sm">
                    {song}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        <div
          onClick={() => handleCardClick("achievements")}
          className={`glass-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            expandedCard === "achievements" ? "col-span-1 sm:col-span-2" : ""
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">🏆 Achievements</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.achievements}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Library className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            {expandedCard === "achievements" && (
              <div className="mt-4 space-y-2">
                <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded">
                  <p className="text-sm opacity-80">Latest Achievement</p>
                  <p className="font-semibold">{stats.latestAchievement}</p>
                </div>
                <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded">
                  <p className="text-sm opacity-80">Next Goal</p>
                  <p className="font-semibold">{stats.nextGoal}</p>
                </div>
              </div>
            )}
          </CardContent>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">This Week</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {stats.sessionsThisWeek} <span className="text-lg">sessions</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg fade-up" style={{ animationDelay: "0.075s" }}>
        <h3 className="text-lg font-semibold mb-4">Progress This Week</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Weekly Practice Goal</span>
              <span>{stats.totalPracticeTime}/60 min</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.weeklyGoalProgress}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Skill Development</span>
              <span>Level {Math.floor(stats.skillLevelProgress / 10)}/10</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.skillLevelProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Recently Played</h2>
              <p className="text-sm text-muted-foreground">Your recent worship sessions</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (process.env.NODE_ENV === "development") {
                console.log("[v0] 📚 DASHBOARD: View All button clicked - navigating to songs")
              }
              onNavigate("songs")
            }}
            className="hidden md:flex"
          >
            View All
          </Button>
        </div>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="space-y-3">
              {recentlyPlayed.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handlePlayTrack(track)}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-border/50 fade-up"
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={track.image || "/placeholder.svg"}
                      alt={track.title}
                      className="w-16 h-16 rounded-lg object-cover shadow-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium tabular-nums">{track.duration}</p>
                    <p className="text-xs text-muted-foreground">{track.playedAt}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-6 bg-transparent hover:bg-muted/50"
              onClick={() => {
                if (process.env.NODE_ENV === "development") {
                  console.log("[v0] 📚 DASHBOARD: View All Songs button clicked")
                }
                onNavigate("songs")
              }}
            >
              View All Songs
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 fade-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-2xl font-bold">Featured Worship Songs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredSongs.map((song, index) => (
            <Card key={song.title} className="song-card fade-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 relative flex items-center justify-center">
                <Music className="w-16 h-16 text-amber-600 dark:text-amber-400 opacity-50" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Key: {song.key}
                  </Badge>
                  <Badge className="compatibility-badge tier-perfect text-xs">{song.tier}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="glass-card group cursor-pointer hover:scale-105 transition-transform fade-up"
          style={{ animationDelay: "0.5s" }}
          onClick={() => {
            if (process.env.NODE_ENV === "development") {
              console.log("[v0] 🎵 Dashboard: Navigating to handpan")
            }
            onNavigate("handpan")
          }}
        >
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Interactive Handpan</CardTitle>
            <CardDescription>Play the D Kurd 10 scale with authentic 432 Hz frequencies</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gap-2">
              <Play className="w-4 h-4" />
              Start Playing
            </Button>
          </CardContent>
        </Card>

        <Card
          className="glass-card group cursor-pointer hover:scale-105 transition-transform fade-up"
          style={{ animationDelay: "0.6s" }}
          onClick={() => {
            if (process.env.NODE_ENV === "development") {
              console.log("[v0] 📚 Dashboard: Navigating to songs")
            }
            onNavigate("songs")
          }}
        >
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Library className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Song Library</CardTitle>
            <CardDescription>Worship songs with chord progressions and video tutorials</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gap-2" variant="secondary">
              <Library className="w-4 h-4" />
              Browse Songs
            </Button>
          </CardContent>
        </Card>

        <Card
          className="glass-card group cursor-pointer hover:scale-105 transition-transform fade-up"
          style={{ animationDelay: "0.7s" }}
          onClick={() => {
            if (process.env.NODE_ENV === "development") {
              console.log("[v0] 📖 Dashboard: Navigating to devotions")
            }
            onNavigate("devotions")
          }}
        >
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Devotions</CardTitle>
            <CardDescription>Righteousness-focused meditations and scripture reflections</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gap-2" variant="secondary">
              <BookOpen className="w-4 h-4" />
              Read Devotions
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>About This Instrument</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">YataoPan D Kurd 10</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The D Kurd scale is one of the most popular handpan scales, known for its meditative and contemplative
                qualities. Perfect for worship and spiritual practice.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tuning Standard:</span>
                  <span className="font-medium">A = 432 Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Root Note:</span>
                  <span className="font-medium">D3 (144.548 Hz)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scale:</span>
                  <span className="font-medium">D Aeolian / D Minor</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Note Layout</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Center (Dome):</span>
                  <span className="font-medium">D3</span>
                </div>
                <div className="text-muted-foreground text-xs mb-2">Outer Ring (Clockwise from 6:00):</div>
                <div className="grid grid-cols-3 gap-2">
                  {["A3", "Bb3", "D4", "F4", "A4", "C5", "G4", "E4", "C4"].map((note) => (
                    <div key={note} className="text-center py-1 px-2 rounded bg-muted/50 text-xs font-medium">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
