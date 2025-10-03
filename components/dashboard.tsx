"use client"

import { Music, Library, BookOpen, Play, Clock } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Section = "dashboard" | "handpan" | "songs" | "devotions"

interface DashboardProps {
  onNavigate: (section: Section) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const featuredSongs = [
    {
      title: "Way Maker",
      artist: "Leeland",
      key: "F",
      youtubeId: "eK_cqO0hdRs", // Verified embeddable version
      tier: "Perfect Match",
    },
    {
      title: "Build My Life",
      artist: "Pat Barrett",
      key: "F",
      youtubeId: "K9jnbS-vpRc", // Verified embeddable
      tier: "Perfect Match",
    },
    {
      title: "Goodness of God",
      artist: "Bethel Music",
      key: "Dm",
      youtubeId: "x3bfa3DZ8JM", // Verified embeddable
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 fade-up">
        <h1 className="text-4xl md:text-5xl font-bold text-balance">Welcome to Handpan Worship</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Experience worship through the harmonic resonance of the YataoPan D Kurd 10, tuned to 432 Hz
        </p>
      </div>

      <div className="space-y-4 fade-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-2xl font-bold">Featured Worship Songs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredSongs.map((song, index) => (
            <Card
              key={song.youtubeId}
              className="song-card fade-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="aspect-video bg-muted relative video-thumbnail">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${song.youtubeId}?rel=0&modestbranding=1&controls=1`}
                  title={song.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full rounded-t-lg"
                  loading="lazy"
                />
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
          onClick={() => onNavigate("handpan")}
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
          onClick={() => onNavigate("songs")}
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
          onClick={() => onNavigate("devotions")}
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
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <CardTitle>Recently Played</CardTitle>
          </div>
          <CardDescription>Your recent worship sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyPlayed.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={track.image || "/placeholder.svg"}
                    alt={track.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{track.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium">{track.duration}</p>
                  <p className="text-xs text-muted-foreground">{track.playedAt}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => onNavigate("songs")}>
            View All Songs
          </Button>
        </CardContent>
      </Card>

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
