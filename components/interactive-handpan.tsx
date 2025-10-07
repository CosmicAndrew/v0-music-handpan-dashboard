"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, VolumeX, Play, Pause } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

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
  F: { note: "F4", frequency: 342.338, name: "F Major", color: "#10b981" },
  C: { note: "C4", frequency: 257.432, name: "C Major", color: "#3b82f6" },
  Bb: { note: "Bb3", frequency: 228.874, name: "Bb Major", color: "#8b5cf6" },
  G: { note: "G4", frequency: 384.444, name: "G Major", color: "#f59e0b" },

  // Minor Chords
  Dm: { note: "D4", frequency: 288.0, name: "D Minor", color: "#ef4444" },
  Dm7: { note: "D4", frequency: 288.0, name: "D Minor 7", color: "#dc2626" }, // Note: F4, A3, C4 would be the notes. This entry might need adjustment based on actual note mapping.
  Am: { note: "A3", frequency: 216.0, name: "A Minor", color: "#ec4899" },

  // Seventh Chords
  Fmaj7: { note: "F4", frequency: 342.338, name: "F Major 7", color: "#14b8a6" },
  Cmaj7: { note: "C4", frequency: 257.432, name: "C Major 7", color: "#06b6d4" },
  Bbmaj7: { note: "Bb3", frequency: 228.874, name: "Bb Major 7", color: "#a855f7" },

  // Extended Chords
  Fsus2: { note: "F4", frequency: 342.338, name: "F Suspended 2", color: "#22c55e" },
  Csus4: { note: "C4", frequency: 257.432, name: "C Suspended 4", color: "#3b82f6" },
  Dm9: { note: "D4", frequency: 288.0, name: "D Minor 9", color: "#f43f5e" },

  // Atmospheric Chords
  D5: { note: "D3", frequency: 144.548, name: "D Power Chord", color: "#6366f1" },
  A5: { note: "A3", frequency: 216.0, name: "A Power Chord", color: "#8b5cf6" },
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
  const [reverb, setReverb] = useState(50)
  const [sustain, setSustain] = useState(70)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState<Array<{ note: string; time: number }>>([])
  const recordingStartTimeRef = useRef<number>(0)

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

    const reverbGain = ctx.createGain()
    reverbGain.gain.value = reverb / 100

    oscillator.connect(gainNode)
    gainNode.connect(reverbGain)
    reverbGain.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    const adjustedVolume = (volume / 100) * 0.3
    const sustainTime = (sustain / 100) * 3 + 1 // 1-4 seconds based on sustain

    gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sustainTime)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + sustainTime)

    setActiveNote(note)
    setTimeout(() => setActiveNote(null), sustainTime * 1000)

    if (isRecording) {
      const elapsedTime = Date.now() - recordingStartTimeRef.current
      setRecordedNotes((prev) => [...prev, { note, time: elapsedTime }])
    }

    if (x && y) {
      const rippleId = Date.now()
      setRipples((prev) => [...prev, { id: rippleId, x, y }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId))
      }, 600)
    }

    console.log(
      "[v0] Playing note:",
      note,
      "at frequency:",
      frequency,
      "Hz",
      "with reverb:",
      reverb,
      "sustain:",
      sustain,
    )
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
      setTimeout(() => {
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

      if (index === 0) patternTimeoutRef.current = setTimeout(() => setIsPlaying(false), 2000)
    })
  }

  const playScale = () => {
    if (isMuted || !audioContextRef.current) return

    const scaleNotes = [
      handpanNotes.center,
      ...handpanNotes.outerRing.filter((n) => ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"].includes(n.note)),
    ]

    scaleNotes.forEach((noteData, index) => {
      setTimeout(() => {
        const position =
          noteData.note === handpanNotes.center.note
            ? { x: centerX, y: centerY }
            : nonagonPositions[handpanNotes.outerRing.findIndex((n) => n.note === noteData.note)]

        playNote(noteData.frequency, noteData.note, position.x, position.y)
      }, index * 400)
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

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setRecordedNotes([])
      recordingStartTimeRef.current = Date.now()
      console.log("[v0] Recording started")
    } else {
      setIsRecording(false)
      console.log("[v0] Recording stopped. Recorded notes:", recordedNotes)
    }
  }

  const isNoteHighlighted = (noteName: string) => {
    return highlightedNotes.includes(noteName)
  }

  return (
    <div className="layout-designer space-y-4 sm:space-y-6 fade-in">
      <div className="designer-header glass-surface p-4 sm:p-6 rounded-xl border border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Interactive Handpan Layout Designer</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Design and customize your YataoPan D Kurd 10 experience</p>
          </div>
          <div className="designer-controls flex gap-2 flex-wrap justify-end">
            <Button
              variant={!showControls ? "default" : "outline"}
              className="control-btn text-xs sm:text-sm"
              onClick={() => setShowControls(false)}
            >
              <span className="hidden sm:inline">👁️ Preview Mode</span>
              <span className="sm:hidden">👁️</span>
              <span className="text-xs hidden sm:block">View & Play Notes</span>
            </Button>
            <Button
              variant={showControls ? "default" : "outline"}
              className="control-btn text-xs sm:text-sm"
              onClick={() => setShowControls(true)}
            >
              <span className="hidden sm:inline">🎯 Practice Mode</span>
              <span className="sm:hidden">🎯</span>
              <span className="text-xs hidden sm:block">Learn & Record</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="glass-button bg-white/90 hover:bg-white min-w-[44px] min-h-[44px]"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-900" /> : <Volume2 className="w-4 h-4 text-gray-900" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="designer-workspace grid lg:grid-cols-[300px_1fr_280px] gap-4 sm:gap-6">
        {/* Left Sidebar - Configuration Panel */}
        <div className="layout-sidebar glass-elevated p-4 sm:p-6 rounded-xl border border-white/10 space-y-4 sm:space-y-6 hidden lg:block">
          <div>
            <h4 className="text-lg font-semibold mb-4">Configuration</h4>

            <div className="config-section space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Frequency Tuning</label>
                <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                  <option>432Hz (Sacred)</option>
                  <option>440Hz (Standard)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Scale Pattern</label>
                <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                  <option>D Kurd 10</option>
                  <option>C Major</option>
                  <option>A Minor</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Note Layout</label>
                <div className="note-list space-y-2 max-h-[400px] overflow-y-auto">
                  <div className="note-config flex justify-between items-center p-2 rounded bg-white/5 border border-white/10">
                    <span className="font-medium">{handpanNotes.center.note}</span>
                    <span className="text-xs text-muted-foreground">{handpanNotes.center.frequency.toFixed(1)}Hz</span>
                  </div>
                  {handpanNotes.outerRing.map((note) => (
                    <div
                      key={note.note}
                      className="note-config flex justify-between items-center p-2 rounded bg-white/5 border border-white/10"
                    >
                      <span className="font-medium">{note.note}</span>
                      <span className="text-xs text-muted-foreground">{note.frequency.toFixed(1)}Hz</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Handpan Preview Area */}
        <div className="handpan-preview-area space-y-4">
          <div className="preview-frame glass-elevated p-3 sm:p-6 rounded-xl border border-white/10">
            <div className="flex justify-center relative">
              <svg viewBox="0 0 800 800" className="w-full max-w-full sm:max-w-2xl touch-none select-none" style={{ maxHeight: "min(80vh, 600px)" }}>
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

                <circle
                  cx={centerX}
                  cy={centerY}
                  r="350"
                  fill="url(#handpanGradient)"
                  stroke="#6b5744"
                  strokeWidth="4"
                  filter="drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))"
                />

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
          </div>

          <div className="preview-controls flex gap-3 justify-center">
            <Button onClick={playScale} className="preview-btn gap-2 control-btn">
              ⚡ Play Scale
            </Button>
            <Button
              onClick={playPattern}
              className="preview-btn gap-2 control-btn"
              variant={isPlaying ? "destructive" : "default"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  ⏸️ Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  ▶️ Play Patterns
                </>
              )}
            </Button>
            <Button
              onClick={toggleRecording}
              className="preview-btn gap-2 control-btn"
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? "⏹️ Stop Recording" : "🔴 Record Session"}
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="properties-panel glass-elevated p-4 sm:p-6 rounded-xl border border-white/10 space-y-4 sm:space-y-6 hidden lg:block">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-shadow-strong bg-black/20 px-3 py-2 rounded-lg">
              🎛️ Sacred Sound Properties
            </h4>

            <div className="space-y-6">
              <div className="property-group">
                <label className="text-sm font-medium flex items-center justify-between mb-2 text-shadow-strong bg-black/15 px-2 py-1 rounded">
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />🔊 Volume
                  </span>
                  <span className="text-xs font-bold bg-black/30 px-2 py-0.5 rounded">{volume}%</span>
                </label>
                <Slider
                  value={[volume]}
                  onValueChange={(v) => setVolume(v[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full sacred-slider"
                />
              </div>

              <div className="property-group">
                <label className="text-sm font-medium flex items-center justify-between mb-2 text-shadow-strong bg-black/15 px-2 py-1 rounded">
                  <span>🌊 Reverb</span>
                  <span className="text-xs font-bold bg-black/30 px-2 py-0.5 rounded">{reverb}%</span>
                </label>
                <Slider
                  value={[reverb]}
                  onValueChange={(v) => setReverb(v[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full sacred-slider"
                />
              </div>

              <div className="property-group">
                <label className="text-sm font-medium flex items-center justify-between mb-2 text-shadow-strong bg-black/15 px-2 py-1 rounded">
                  <span>🎵 Sustain</span>
                  <span className="text-xs font-bold bg-black/30 px-2 py-0.5 rounded">{sustain}%</span>
                </label>
                <Slider
                  value={[sustain]}
                  onValueChange={(v) => setSustain(v[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full sacred-slider"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="text-sm font-medium mb-3 block text-shadow-strong bg-black/20 px-3 py-2 rounded-lg">
                  Worship Patterns
                </label>
                <select
                  value={selectedPattern}
                  onChange={(e) => setSelectedPattern(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-white/95 dark:bg-white/90 text-gray-900 font-medium border-2 border-white/30 shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {worshipPatterns.map((pattern, index) => (
                    <option key={pattern.name} value={index} className="py-2 text-gray-900 font-medium">
                      {pattern.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="text-sm font-medium mb-2 block text-shadow-strong bg-black/20 px-3 py-2 rounded-lg">
                  Chord Pads
                </label>
                <p className="text-xs mb-3 text-shadow-strong bg-black/15 px-2 py-1 rounded">
                  Click to play • Right-click for variations
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {/* Row 1 - Major Chords */}
                  <Button
                    onClick={() => playChord("F")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("F")
                    }}
                    variant={activeChord === "F" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "F" ? chordDefinitions.F.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.F.color,
                      borderWidth: "2px",
                      color: activeChord === "F" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">F</span>
                    <span className="text-xs text-muted-foreground">Major</span>
                  </Button>
                  <Button
                    onClick={() => playChord("C")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("C")
                    }}
                    variant={activeChord === "C" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "C" ? chordDefinitions.C.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.C.color,
                      borderWidth: "2px",
                      color: activeChord === "C" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">C</span>
                    <span className="text-xs text-muted-foreground">Major</span>
                  </Button>
                  <Button
                    onClick={() => playChord("Bb")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Bb")
                    }}
                    variant={activeChord === "Bb" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "Bb" ? chordDefinitions.Bb.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Bb.color,
                      borderWidth: "2px",
                      color: activeChord === "Bb" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Bb</span>
                    <span className="text-xs text-muted-foreground">Major</span>
                  </Button>

                  {/* Row 2 - Minor Chords */}
                  <Button
                    onClick={() => playChord("G")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("G")
                    }}
                    variant={activeChord === "G" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "G" ? chordDefinitions.G.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.G.color,
                      borderWidth: "2px",
                      color: activeChord === "G" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">G</span>
                    <span className="text-xs text-muted-foreground">Major</span>
                  </Button>
                  <Button
                    onClick={() => playChord("Dm")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Dm")
                    }}
                    variant={activeChord === "Dm" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "Dm" ? chordDefinitions.Dm.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Dm.color,
                      borderWidth: "2px",
                      color: activeChord === "Dm" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Dm</span>
                    <span className="text-xs text-muted-foreground">Minor</span>
                  </Button>
                  <Button
                    onClick={() => playChord("Am")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Am")
                    }}
                    variant={activeChord === "Am" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "Am" ? chordDefinitions.Am.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Am.color,
                      borderWidth: "2px",
                      color: activeChord === "Am" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Am</span>
                    <span className="text-xs text-muted-foreground">Minor</span>
                  </Button>

                  {/* Row 3 - Seventh Chords */}
                  <Button
                    onClick={() => playChord("Dm7")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Dm7")
                    }}
                    variant={activeChord === "Dm7" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "Dm7" ? chordDefinitions.Dm7.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Dm7.color,
                      borderWidth: "2px",
                      color: activeChord === "Dm7" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Dm7</span>
                    <span className="text-xs text-muted-foreground">Min 7</span>
                  </Button>
                  <Button
                    onClick={() => playChord("Fmaj7")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Fmaj7")
                    }}
                    variant={activeChord === "Fmaj7" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor:
                        activeChord === "Fmaj7" ? chordDefinitions.Fmaj7.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Fmaj7.color,
                      borderWidth: "2px",
                      color: activeChord === "Fmaj7" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Fmaj7</span>
                    <span className="text-xs text-muted-foreground">Maj 7</span>
                  </Button>
                  <Button
                    onClick={() => playChord("Bbmaj7")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Bbmaj7")
                    }}
                    variant={activeChord === "Bbmaj7" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor:
                        activeChord === "Bbmaj7" ? chordDefinitions.Bbmaj7.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Bbmaj7.color,
                      borderWidth: "2px",
                      color: activeChord === "Bbmaj7" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Bbmaj7</span>
                    <span className="text-xs text-muted-foreground">Maj 7</span>
                  </Button>

                  {/* Row 4 - Extended Chords */}
                  <Button
                    onClick={() => playChord("Cmaj7")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Cmaj7")
                    }}
                    variant={activeChord === "Cmaj7" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor:
                        activeChord === "Cmaj7" ? chordDefinitions.Cmaj7.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Cmaj7.color,
                      borderWidth: "2px",
                      color: activeChord === "Cmaj7" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Cmaj7</span>
                    <span className="text-xs text-muted-foreground">Maj 7</span>
                  </Button>
                  <Button
                    onClick={() => playChord("Fsus2")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Fsus2")
                    }}
                    variant={activeChord === "Fsus2" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor:
                        activeChord === "Fsus2" ? chordDefinitions.Fsus2.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Fsus2.color,
                      borderWidth: "2px",
                      color: activeChord === "Fsus2" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Fsus2</span>
                    <span className="text-xs text-muted-foreground">Sus 2</span>
                  </Button>
                  <Button
                    onClick={() => playChord("Csus4")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Csus4")
                    }}
                    variant={activeChord === "Csus4" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor:
                        activeChord === "Csus4" ? chordDefinitions.Csus4.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Csus4.color,
                      borderWidth: "2px",
                      color: activeChord === "Csus4" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Csus4</span>
                    <span className="text-xs text-muted-foreground">Sus 4</span>
                  </Button>

                  {/* Row 5 - Power Chords & Extended */}
                  <Button
                    onClick={() => playChord("Dm9")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("Dm9")
                    }}
                    variant={activeChord === "Dm9" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "Dm9" ? chordDefinitions.Dm9.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.Dm9.color,
                      borderWidth: "2px",
                      color: activeChord === "Dm9" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">Dm9</span>
                    <span className="text-xs text-muted-foreground">Min 9</span>
                  </Button>
                  <Button
                    onClick={() => playChord("D5")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("D5")
                    }}
                    variant={activeChord === "D5" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "D5" ? chordDefinitions.D5.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.D5.color,
                      borderWidth: "2px",
                      color: activeChord === "D5" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">D5</span>
                    <span className="text-xs text-muted-foreground">Power</span>
                  </Button>
                  <Button
                    onClick={() => playChord("A5")}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      showChordVariations("A5")
                    }}
                    variant={activeChord === "A5" ? "default" : "outline"}
                    className="text-xs h-12 flex flex-col items-center justify-center font-bold shadow-lg"
                    style={{
                      backgroundColor: activeChord === "A5" ? chordDefinitions.A5.color : "rgba(255, 255, 255, 0.9)",
                      borderColor: chordDefinitions.A5.color,
                      borderWidth: "2px",
                      color: activeChord === "A5" ? "white" : "#1f2937",
                    }}
                  >
                    <span className="font-bold text-lg">A5</span>
                    <span className="text-xs text-muted-foreground">Power</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  .filter(([key]) => {
                    const baseNote = selectedChordForVariations.replace(/[^A-G#b]/g, "")
                    return key.startsWith(baseNote)
                  })
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
