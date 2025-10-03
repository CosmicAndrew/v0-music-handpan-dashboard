"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music2 } from "@/components/icons"

const worshipSongs = [
  {
    title: "Way Maker",
    artist: "Leeland",
    key: "F",
    chords: ["F", "C", "Dm", "Bb"],
    youtubeId: "eK_cqO0hdRs", // Verified embeddable
    ministry: "General",
    tier: "Perfect Match",
  },
  {
    title: "I Speak Jesus",
    artist: "Charity Gayle",
    key: "F",
    chords: ["F", "Am", "Bb", "C"],
    youtubeId: "n37MZ1xmwSE",
    ministry: "Lifestyle Christianity",
    tier: "Perfect Match",
  },
  {
    title: "Build My Life",
    artist: "Pat Barrett",
    key: "F",
    chords: ["F", "C", "Dm", "Bb"],
    youtubeId: "K9jnbS-vpRc", // Verified embeddable
    ministry: "General",
    tier: "Perfect Match",
  },
  {
    title: "Goodness of God",
    artist: "Bethel Music",
    key: "Dm",
    chords: ["Dm", "Bb", "F", "C"],
    youtubeId: "x3bfa3DZ8JM", // Verified embeddable
    ministry: "General",
    tier: "Perfect Match",
  },
  {
    title: "Oceans (Where Feet May Fail)",
    artist: "Hillsong UNITED",
    key: "Dm",
    chords: ["Dm", "Bb", "F", "C"],
    youtubeId: "dy9nwe9_xzw", // Verified embeddable
    ministry: "General",
    tier: "Perfect Match",
  },
  {
    title: "How Great Is Our God",
    artist: "Chris Tomlin",
    key: "C",
    chords: ["C", "Am", "F", "G"],
    youtubeId: "KBD18rsVJHk", // Verified embeddable
    ministry: "General",
    tier: "Strong Match",
  },
]

export function SongLibrary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Worship Song Library</h1>
        <p className="text-muted-foreground">Songs perfectly suited for the D Kurd 10 handpan</p>
      </div>

      <div className="grid gap-6">
        {worshipSongs.map((song) => (
          <Card key={song.youtubeId} className="glass-card overflow-hidden">
            <div className="grid md:grid-cols-[560px_1fr] gap-6">
              <div className="aspect-video bg-muted relative">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${song.youtubeId}?rel=0&modestbranding=1&controls=1`}
                  title={song.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-2xl font-bold">{song.title}</h3>
                      <p className="text-muted-foreground">{song.artist}</p>
                    </div>
                    <Badge variant="secondary">{song.tier}</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-3">
                    <Badge variant="outline">Key: {song.key}</Badge>
                    <Badge variant="outline">{song.ministry}</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Music2 className="w-4 h-4" />
                    Chord Progression
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {song.chords.map((chord, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 font-mono font-bold text-lg"
                      >
                        {chord}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    This song works beautifully with the D Kurd scale. The chord progression aligns perfectly with the
                    available notes on your handpan.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
