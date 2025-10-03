"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, VolumeX, Play, Pause, Settings2 } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

// Layout: clockwise from 6:00 position: A3, Bb3, D4, F4, A4, C5, G4, E4, C4
const handpanNotes = {
  center: { note: "D3", frequency: 144.548 },
  // Outer ring in clockwise order starting at 6:00 (bottom)
  outerRing: [
    { note: "A3", frequency: 216.0, position: "6:00" },
    { note: "Bb3", frequency: 228.874, position: "7:20" },
    { note: "D4", frequency: 288.0, position: "8:40" },
    { note: "F4", frequency: 342.338, position: "10:00" },
    { note: "A4", frequency: 432.0, position: "11:20" },
    { note: "C5", frequency: 514.864, position: "12:40" },
    { note: "G4", frequency: 384.444, position: "2:00" },
    { note: "E4", frequency: 323.551, position: "3:20" },
    { note: "C4", frequency: 257.432, position: "4:40" },
  ],
}

// Calculate nonagon positions using the exact mathematical formula
// angle(i) = π/2 + i * (2π/9); pos = center + r*[cos(angle), sin(angle)]
function calculateNonagonPositions(centerX: number, centerY: number, radius: number) {
  const positions = []
  for (let i = 0; i < 9; i++) {
    const angle = Math.PI / 2 + i * ((2 * Math.PI) / 9)
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    positions.push({ x, y })
  }
  return positions
}

const worshipPatterns = [
  {
    name: "Peaceful Flow",
    notes: ["D3", "A3", "C4", "D4", "F4", "D4", "C4", "A3"],
    timing: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500],
  },
  {
    name: "Ascending Praise",
    notes: ["D3", "A3", "D4", "F4", "A4", "C5"],
    timing: [0, 600, 1200, 1800, 2400, 3000],
  },
  {
    name: "Contemplative",
    notes: ["D3", "E4", "G4", "A4", "G4", "E4", "D3"],
    timing: [0, 800, 1600, 2400, 3200, 4000, 4800],
  },
]

const chordDefinitions = {
  // Major Chords
  F: { notes: ["F4", "A4", "C5"], name: "F Major", color: "#10b981" },
  C: { notes: ["C4", "E4", "G4"], name: "C Major", color: "#3b82f6" },
  Bb: { notes: ["Bb3", "D4", "F4"], name: "Bb Major", color: "#8b5cf6" },
  G: { notes: ["G4", "D4", "A4"], name: "G Major", color: "#f59e0b" },

  // Minor Chords
  Dm: { notes: ["D3", "F4", "A3"], name: "D Minor", color: "#ef4444" },
  Dm7: { notes: ["D3", "F4", "A3", "C4"], name: "D Minor 7", color: "#dc2626" },
  Am: { notes: ["A3", "C4", "E4"], name: "A Minor", color: "#ec4899" },

  // Seventh Chords
  Fmaj7: { notes: ["F4", "A4", "C5", "E4"], name: "F Major 7", color: "#14b8a6" },
  Cmaj7: { notes: ["C4", "E4", "G4", "D4"], name: "C Major 7", color: "#06b6d4" },
  Bbmaj7: { notes: ["Bb3", "D4", "F4", "A4"], name: "Bb Major 7", color: "#a855f7" },

  // Extended Chords
  Fsus2: { notes: ["F4", "G4", "C5"], name: "F Suspended 2", color: "#22c55e" },
  Csus4: { notes: ["C4", "F4", "G4"], name: "C Suspended 4", color: "#3b82f6" },
  Dm9: { notes: ["D3", "F4", "A3", "C4", "E4"], name: "D Minor 9", color: "#f43f5e" },

  // Atmospheric Chords
  D5: { notes: ["D3", "A3", "D4"], name: "D Power Chord", color: "#6366f1" },
  A5: { notes: ["A3", "E4", "A4"], name: "A Power Chord", color: "#8b5cf6" },
}

const meditationModes = {
  bloodCovenant: {
    name: "Blood Covenant Meditation",
    chords: ["Dm7", "Fmaj7", "Dm7", "Fmaj7"],
    timing: [0, 2000, 4000, 6000],
  },
  crossVictory: {
    name: "Cross Victory Meditation",
    chords: ["F", "C", "Dm", "Bb"],
    timing: [0, 2000, 4000, 6000],
  },
  gospelFoundation: {
    name: "Gospel Foundation",
    chords: ["Dm", "Bb", "F", "C"],
    timing: [0, 2000, 4000, 6000],
  },
  peaceThroughBlood: {
    name: "Peace Through Blood",
    chords: ["Fmaj7", "Cmaj7", "Dm7", "Bbmaj7"],
    timing: [0, 2500, 5000, 7500],
  },
  righteousIdentity: {
    name: "Righteous Identity",
    chords: ["F", "Am", "Bb", "C"],
    timing: [0, 2000, 4000, 6000],
  },
}

export function InteractiveHandpan() {
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([])
  const [activeChord, setActiveChord] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [showChordModal, setShowChordModal] = useState(false)
  const [selectedChordForVariations, setSelectedChordForVariations] = useState<string | null>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const audioContextRef = useRef<AudioContext | null>(null)
  const patternTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const centerX = 400
  const centerY = 400
  const outerRadius = 200
  const centerRadius = 80
  const noteRadius = 45
  const nonagonPositions = calculateNonagonPositions(centerX, centerY, outerRadius)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      const savedVolume = localStorage.getItem("handpan-volume")
      if (savedVolume) setVolume(Number.parseInt(savedVolume))
    }
    return () => {
      audioContextRef.current?.close()
      if (patternTimeoutRef.current) clearTimeout(patternTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("handpan-volume", volume.toString())
  }, [volume])

  const playNote = (frequency: number, note: string, x?: number, y?: number) => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    const adjustedVolume = (volume / 100) * 0.3
    gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 2)

    setActiveNote(note)
    setTimeout(() => setActiveNote(null), 2000)

    if (x && y) {
      const rippleId = Date.now()
      setRipples((prev) => [...prev, { id: rippleId, x, y }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId))
      }, 600)
    }

    console.log("[v0] Playing note:", note, "at frequency:", frequency, "Hz")
  }

  const playPattern = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (patternTimeoutRef.current) clearTimeout(patternTimeoutRef.current)
      return
    }

    setIsPlaying(true)
    const pattern = worshipPatterns[selectedPattern]

    pattern.notes.forEach((noteName, index) => {
      const timeout = setTimeout(() => {
        const noteData =
          noteName === handpanNotes.center.note
            ? handpanNotes.center
            : handpanNotes.outerRing.find((n) => n.note === noteName)

        if (noteData) {
          const position =
            noteName === handpanNotes.center.note
              ? { x: centerX, y: centerY }
              : nonagonPositions[handpanNotes.outerRing.findIndex((n) => n.note === noteName)]

          playNote(noteData.frequency, noteData.note, position.x, position.y)
        }

        if (index === pattern.notes.length - 1) {
          setTimeout(() => setIsPlaying(false), 2000)
        }
      }, pattern.timing[index])

      if (index === 0) patternTimeoutRef.current = timeout
    })
  }

  const playChord = (chordKey: string) => {
    if (isMuted || !audioContextRef.current) return

    const chord = chordDefinitions[chordKey]
    if (!chord) return

    console.log("[v0] Playing chord:", chordKey, "with notes:", chord.notes)

    const ctx = audioContextRef.current
    setActiveChord(chordKey)
    setHighlightedNotes(chord.notes)

    chord.notes.forEach((noteName, index) => {
      setTimeout(() => {
        const noteData =
          noteName === handpanNotes.center.note
            ? handpanNotes.center
            : handpanNotes.outerRing.find((n) => n.note === noteName)

        if (noteData) {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)

          oscillator.frequency.value = noteData.frequency
          oscillator.type = "sine"

          const adjustedVolume = (volume / 100) * 0.25
          gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3)

          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 3)

          console.log("[v0] Chord note:", noteName, "at", noteData.frequency, "Hz")
        }
      }, index * 150)
    })

    setTimeout(() => {
      setActiveChord(null)
      setHighlightedNotes([])
    }, 3000)
  }

  const showChordVariations = (baseChord: string) => {
    setSelectedChordForVariations(baseChord)
    setShowChordModal(true)
  }

  const isNoteHighlighted = (noteName: string) => {
    return highlightedNotes.includes(noteName)
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interactive Handpan</h1>
          <p className="text-muted-foreground">Click or tap notes to play • 432 Hz tuning</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowControls(!showControls)} className="glass-button">
            <Settings2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)} className="glass-button">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {showControls && (
        <Card className="glass-card scale-in border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Audio Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Volume: {volume}%
              </label>
              <Slider
                value={[volume]}
                onValueChange={(v) => setVolume(v[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Worship Patterns</label>
              <div className="flex gap-2 flex-wrap">
                {worshipPatterns.map((pattern, index) => (
                  <Badge
                    key={pattern.name}
                    variant={selectedPattern === index ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedPattern(index)}
                  >
                    {pattern.name}
                  </Badge>
                ))}
              </div>
              <Button onClick={playPattern} className="w-full gap-2" variant={isPlaying ? "destructive" : "default"}>
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Stop Pattern
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play Pattern
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chord Pads</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(chordDefinitions)
                  .slice(0, 12)
                  .map(([key, chord]) => (
                    <Button
                      key={key}
                      onClick={() => playChord(key)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        showChordVariations(key)
                      }}
                      variant={activeChord === key ? "default" : "outline"}
                      className="text-xs h-12 relative overflow-hidden"
                      style={{
                        backgroundColor: activeChord === key ? chord.color : undefined,
                        borderColor: chord.color,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold">{key}</span>
                        <span className="text-[10px] opacity-70">{chord.notes.length} notes</span>
                      </div>
                    </Button>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground">Click to play • Right-click for variations</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meditation Modes</label>
              <div className="space-y-2">
                {Object.entries(meditationModes).map(([key, mode]) => (
                  <Button
                    key={key}
                    onClick={() => {
                      // Play chord progression
                      mode.chords.forEach((chord, index) => {
                        setTimeout(() => playChord(chord), mode.timing[index])
                      })
                    }}
                    variant="outline"
                    className="w-full text-xs justify-start"
                  >
                    {mode.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card scale-in border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl">YataoPan D Kurd 10</CardTitle>
          <CardDescription>Touch or click any note to hear its harmonic resonance at 432 Hz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center relative">
            <svg viewBox="0 0 800 800" className="w-full max-w-2xl touch-none select-none">
              <defs>
                <radialGradient id="handpanGradient" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#d4a574" />
                  <stop offset="50%" stopColor="#b8956a" />
                  <stop offset="100%" stopColor="#8b7355" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="chordGlow">
                  <feGaussianBlur stdDeviation="10" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Main body */}
              <circle
                cx={centerX}
                cy={centerY}
                r="350"
                fill="url(#handpanGradient)"
                stroke="#6b5744"
                strokeWidth="4"
                filter="drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))"
              />

              {/* Ripple effects */}
              {ripples.map((ripple) => (
                <circle
                  key={ripple.id}
                  cx={ripple.x}
                  cy={ripple.y}
                  r="40"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  opacity="0.6"
                  className="animate-ripple"
                />
              ))}

              <g
                className="handpan-note"
                onClick={() => playNote(handpanNotes.center.frequency, handpanNotes.center.note, centerX, centerY)}
              >
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={centerRadius}
                  fill={
                    isNoteHighlighted(handpanNotes.center.note)
                      ? activeChord && chordDefinitions[activeChord]
                        ? chordDefinitions[activeChord].color
                        : "#fbbf24"
                      : activeNote === handpanNotes.center.note
                        ? "#fbbf24"
                        : "#c9a87c"
                  }
                  stroke="#8b7355"
                  strokeWidth="3"
                  filter={
                    isNoteHighlighted(handpanNotes.center.note) || activeNote === handpanNotes.center.note
                      ? "url(#chordGlow)"
                      : ""
                  }
                  className="transition-all duration-300"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={centerRadius - 15}
                  fill="none"
                  stroke="#a0826d"
                  strokeWidth="2"
                  opacity="0.4"
                />
                <text
                  x={centerX}
                  y={centerY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-zinc-800 text-2xl font-bold pointer-events-none"
                >
                  {handpanNotes.center.note}
                </text>
                <text
                  x={centerX}
                  y={centerY + 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-zinc-600 text-xs pointer-events-none"
                >
                  {handpanNotes.center.frequency.toFixed(1)} Hz
                </text>
              </g>

              {handpanNotes.outerRing.map((noteData, index) => {
                const pos = nonagonPositions[index]
                const isHighlighted = isNoteHighlighted(noteData.note)
                return (
                  <g
                    key={noteData.note}
                    className="handpan-note"
                    onClick={() => playNote(noteData.frequency, noteData.note, pos.x, pos.y)}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={noteRadius}
                      fill={
                        isHighlighted
                          ? activeChord && chordDefinitions[activeChord]
                            ? chordDefinitions[activeChord].color
                            : "#fbbf24"
                          : activeNote === noteData.note
                            ? "#fbbf24"
                            : "#d4a574"
                      }
                      stroke="#8b7355"
                      strokeWidth="2"
                      filter={isHighlighted || activeNote === noteData.note ? "url(#chordGlow)" : ""}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={noteRadius - 10}
                      fill="none"
                      stroke="#a0826d"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-zinc-800 text-sm font-bold pointer-events-none"
                    >
                      {noteData.note}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-zinc-600 text-[10px] pointer-events-none"
                    >
                      {noteData.position}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10 slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Frequency Reference (432 Hz)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50 hover:bg-white/5 transition-colors rounded px-2">
                <span className="font-medium">{handpanNotes.center.note} (Center)</span>
                <span className="text-muted-foreground">{handpanNotes.center.frequency.toFixed(3)} Hz</span>
              </div>
              {handpanNotes.outerRing.map((note) => (
                <div
                  key={note.note}
                  className="flex justify-between py-2 border-b border-border/50 hover:bg-white/5 transition-colors rounded px-2"
                >
                  <span className="font-medium">
                    {note.note} ({note.position})
                  </span>
                  <span className="text-muted-foreground">{note.frequency.toFixed(3)} Hz</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle>Playing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Center Dome (D3):</strong> The fundamental note at 144.548 Hz. Use it as your anchor and return
              point.
            </p>
            <p>
              <strong>Nonagon Layout:</strong> 9 outer notes arranged in a perfect nonagon starting at 6:00 (bottom) and
              moving clockwise.
            </p>
            <p>
              <strong>432 Hz Tuning:</strong> A4 = 432 Hz. This natural tuning resonates with the harmonic series and
              promotes relaxation.
            </p>
            <p>
              <strong>D Kurd Scale:</strong> Perfect for contemplative worship. The minor tonality creates a reflective
              atmosphere.
            </p>
            <p>
              <strong>Worship Patterns:</strong> Try the pre-programmed patterns for instant worship melodies, or create
              your own sequences.
            </p>
          </CardContent>
        </Card>
      </div>

      {showChordModal && selectedChordForVariations && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowChordModal(false)}
        >
          <Card className="glass-card max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Chord Variations: {selectedChordForVariations}</CardTitle>
              <CardDescription>Explore different voicings and extensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(chordDefinitions)
                  .filter(([key]) => key.startsWith(selectedChordForVariations.charAt(0)))
                  .map(([key, chord]) => (
                    <Button
                      key={key}
                      onClick={() => {
                        playChord(key)
                        setShowChordModal(false)
                      }}
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-start"
                      style={{ borderColor: chord.color }}
                    >
                      <span className="font-bold text-lg">{key}</span>
                      <span className="text-xs text-muted-foreground">{chord.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{chord.notes.join(", ")}</span>
                    </Button>
                  ))}
              </div>
              <Button onClick={() => setShowChordModal(false)} variant="outline" className="w-full mt-4">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
