"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, VolumeX, Play, Pause } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { audioEngine } from "@/lib/audio-engine"

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
  F: { note: "F4", frequency: 342.338, name: "F Major", color: "#10b981", notes: ["F4", "A4", "C5"] },
  C: { note: "C4", frequency: 257.432, name: "C Major", color: "#3b82f6", notes: ["C4", "E4", "G4"] },
  Bb: { note: "Bb3", frequency: 228.874, name: "Bb Major", color: "#8b5cf6", notes: ["Bb3", "D4", "F4"] },
  G: { note: "G4", frequency: 384.444, name: "G Major", color: "#f59e0b", notes: ["G4", "D4", "C5"] },

  // Minor Chords
  Dm: { note: "D4", frequency: 288.0, name: "D Minor", color: "#ef4444", notes: ["D4", "F4", "A4"] },
  Dm7: { note: "D4", frequency: 288.0, name: "D Minor 7", color: "#dc2626", notes: ["D4", "F4", "A4", "C5"] },
  Am: { note: "A3", frequency: 216.0, name: "A Minor", color: "#ec4899", notes: ["A3", "C4", "E4"] },

  // Seventh Chords
  Fmaj7: { note: "F4", frequency: 342.338, name: "F Major 7", color: "#14b8a6", notes: ["F4", "A4", "C5", "E4"] },
  Cmaj7: { note: "C4", frequency: 257.432, name: "C Major 7", color: "#06b6d4", notes: ["C4", "E4", "G4", "D4"] },
  Bbmaj7: { note: "Bb3", frequency: 228.874, name: "Bb Major 7", color: "#a855f7", notes: ["Bb3", "D4", "F4", "A4"] },

  // Extended Chords
  Fsus2: { note: "F4", frequency: 342.338, name: "F Suspended 2", color: "#22c55e", notes: ["F4", "G4", "C5"] },
  Csus4: { note: "C4", frequency: 257.432, name: "C Suspended 4", color: "#3b82f6", notes: ["C4", "F4", "G4"] },
  Dm9: { note: "D4", frequency: 288.0, name: "D Minor 9", color: "#f43f5e", notes: ["D4", "F4", "A4", "C5", "E4"] },

  // Atmospheric Chords
  D5: { note: "D3", frequency: 144.548, name: "D Power Chord", color: "#6366f1", notes: ["D3", "A3", "D4"] },
  A5: { note: "A3", frequency: 216.0, name: "A Power Chord", color: "#8b5cf6", notes: ["A3", "E4", "A4"] },
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
  const [volume, setVolume] = useState(85)
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
  const [showInfo, setShowInfo] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)

  const patternTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const centerX = 400
  const centerY = 400
  const outerRadius = 200
  const centerRadius = 80
  const noteRadius = 45
  const nonagonPositions = calculateNonagonPositions(centerX, centerY, outerRadius)

  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log("[v0] Initializing audio engine...")
        await audioEngine.initialize()
        setAudioInitialized(true)
        console.log("[v0] ✅ Audio engine initialized successfully")

        const savedVolume = localStorage.getItem("handpan-volume")
        if (savedVolume) {
          const vol = Number.parseInt(savedVolume)
          setVolume(vol)
          audioEngine.setVolume(vol)
          console.log("[v0] Restored volume from localStorage:", vol)
        }
      } catch (error) {
        console.error("[v0] ❌ Failed to initialize audio:", error)
        console.log("[v0] Audio will initialize on first user interaction")
      }
    }

    initAudio()

    return () => {
      if (patternTimeoutRef.current) {
        clearTimeout(patternTimeoutRef.current)
        patternTimeoutRef.current = null
      }
      audioEngine.dispose()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("handpan-volume", volume.toString())
    audioEngine.setVolume(volume)
  }, [volume])

  useEffect(() => {
    audioEngine.setReverb(reverb)
  }, [reverb])

  useEffect(() => {
    audioEngine.setSustain(sustain)
  }, [sustain])

  useEffect(() => {
    if (selectedPattern !== null && isPlaying) {
      const pattern = worshipPatterns[selectedPattern]
      setHighlightedNotes(pattern.notes)
      console.log("[v0] 🎵 Pattern playing:", pattern.name)
      console.log("[v0] 🎯 Highlighting notes:", pattern.notes)
    } else {
      setHighlightedNotes([])
      console.log("[v0] Cleared highlighted notes")
    }
  }, [selectedPattern, isPlaying])

  const playNote = async (frequency: number, note: string, x?: number, y?: number) => {
    console.log("[v0] 🎹 playNote called:", { frequency, note, x, y, isMuted, audioInitialized })

    if (isMuted) {
      console.log("[v0] ⏸️ Audio is muted, skipping playback")
      return
    }

    if (!audioInitialized) {
      console.log("[v0] ⚠️ Audio not initialized, attempting initialization...")
      try {
        await audioEngine.initialize()
        setAudioInitialized(true)
        console.log("[v0] ✅ Audio initialized on user interaction")
      } catch (error) {
        console.error("[v0] ❌ Failed to initialize audio on interaction:", error)
        return
      }
    }

    console.log("[v0] 🔊 Resuming audio context...")
    await audioEngine.resume()

    console.log("[v0] ▶️ Playing note:", note, "at", frequency, "Hz")
    audioEngine.playNote(frequency, note, x && y ? { x, y } : undefined)

    setActiveNote(note)
    setTimeout(() => setActiveNote(null), sustain * 40)

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
  }

  const playPattern = async () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (patternTimeoutRef.current) clearTimeout(patternTimeoutRef.current)
      return
    }

    if (!audioInitialized) {
      try {
        await audioEngine.initialize()
        setAudioInitialized(true)
      } catch (error) {
        console.error("[v0] Failed to initialize audio:", error)
        return
      }
    }

    await audioEngine.resume()

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

  const playScale = async () => {
    if (isMuted) return

    if (!audioInitialized) {
      try {
        await audioEngine.initialize()
        setAudioInitialized(true)
      } catch (error) {
        console.error("[v0] Failed to initialize audio:", error)
        return
      }
    }

    await audioEngine.resume()

    // D3→A3→Bb3→C4→D4→E4→F4→G4→A4→C5
    const scaleNotesInOrder = [
      { note: "D3", frequency: 144.548 }, // D3 - Root note
      { note: "A3", frequency: 216.0 }, // A3 - Perfect fifth
      { note: "Bb3", frequency: 228.874 }, // Bb3 - Minor sixth
      { note: "C4", frequency: 257.432 }, // C4 - Minor seventh
      { note: "D4", frequency: 288.0 }, // D4 - Octave
      { note: "E4", frequency: 323.551 }, // E4 - Major second
      { note: "F4", frequency: 342.338 }, // F4 - Minor third
      { note: "G4", frequency: 384.444 }, // G4 - Perfect fourth
      { note: "A4", frequency: 432.0 }, // A4 - Perfect fifth (octave)
      { note: "C5", frequency: 514.864 }, // C5 - Minor seventh (octave)
    ]

    console.log("[v0] 🎵 Playing D Kurd scale in frequency order")

    scaleNotesInOrder.forEach((noteData, index) => {
      setTimeout(() => {
        const position =
          noteData.note === handpanNotes.center.note
            ? { x: centerX, y: centerY }
            : nonagonPositions[handpanNotes.outerRing.findIndex((n) => n.note === noteData.note)]

        console.log(`[v0] Playing note ${index + 1}/10: ${noteData.note} at ${noteData.frequency}Hz`)
        playNote(noteData.frequency, noteData.note, position.x, position.y)
      }, index * 400)
    })
  }

  const playChord = async (chordKey: string) => {
    if (isMuted) return

    if (!audioInitialized) {
      try {
        await audioEngine.initialize()
        setAudioInitialized(true)
      } catch (error) {
        console.error("[v0] Failed to initialize audio:", error)
        return
      }
    }

    await audioEngine.resume()

    const chord = chordDefinitions[chordKey]
    if (!chord) return

    setActiveChord(chordKey)
    setHighlightedNotes(chord.notes)

    // Get frequencies for chord notes
    const frequencies: number[] = []
    chord.notes.forEach((noteName) => {
      const noteData =
        noteName === handpanNotes.center.note
          ? handpanNotes.center
          : handpanNotes.outerRing.find((n) => n.note === noteName)
      if (noteData) {
        frequencies.push(noteData.frequency)
      }
    })

    audioEngine.playChord(frequencies, chord.notes)

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
    return (isPlaying && highlightedNotes.includes(noteName)) || (activeChord && highlightedNotes.includes(noteName))
  }

  const handleChordRightClick = (e: React.MouseEvent, chordKey: string) => {
    e.preventDefault()
    setSelectedChordForVariations(chordKey)
    setShowChordModal(true)
  }

  const handleModalClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("[v0] FORCE CLOSING MODAL")

    // Force close with multiple methods
    setShowChordModal(false)
    setSelectedChordForVariations(null)

    // Force DOM manipulation if needed
    const modal = document.querySelector('[data-modal="chord-variations"]')
    if (modal) {
      ;(modal as HTMLElement).style.display = "none"
    }

    console.log("[v0] ✅ Modal forcefully closed")
  }

  return (
    <div className="layout-designer space-y-4 md:space-y-6 fade-in">
      <div className="bento-card">
        <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Interactive Handpan</h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Design and customize your YataoPan D Kurd 10 experience
            </p>
          </div>
          <div className="designer-controls flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                console.log("[v0] 🔇 Mute button clicked!")
                console.log("[v0] Current mute state:", isMuted)
                setIsMuted(!isMuted)
                console.log("[v0] New mute state:", !isMuted)
              }}
              className="glass-button bg-white/90 hover:bg-white mobile-touch-target min-h-[44px] min-w-[44px]"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="bento-card">
        <Button onClick={() => setShowInfo(!showInfo)} className="w-full mb-4" variant="outline">
          {showInfo ? "Hide" : "Show"} Handpan Info (Chords, Scales & Notes)
        </Button>

        {showInfo && (
          <div className="handpan-info-panel">
            <div className="info-section">
              <h4>🎵 About D Kurd Scale</h4>
              <p>
                The D Kurd scale is one of the most popular handpan scales, known for its minor, mystical, and
                meditative qualities. Perfect for worship and contemplative music.
              </p>
            </div>

            <div className="info-section">
              <h4>🎼 Scale Notes (432Hz Tuning)</h4>
              <ul>
                <li>
                  <strong>D3 (Center Ding):</strong> 144.548 Hz - Root note, grounding tone
                </li>
                <li>
                  <strong>A3:</strong> 216.0 Hz - Perfect fifth
                </li>
                <li>
                  <strong>Bb3:</strong> 228.874 Hz - Minor sixth
                </li>
                <li>
                  <strong>C4:</strong> 257.432 Hz - Minor seventh
                </li>
                <li>
                  <strong>D4:</strong> 288.0 Hz - Octave
                </li>
                <li>
                  <strong>E4:</strong> 323.551 Hz - Major second
                </li>
                <li>
                  <strong>F4:</strong> 342.338 Hz - Minor third
                </li>
                <li>
                  <strong>G4:</strong> 384.444 Hz - Perfect fourth
                </li>
                <li>
                  <strong>A4:</strong> 432.0 Hz - Perfect fifth (octave)
                </li>
                <li>
                  <strong>C5:</strong> 514.864 Hz - Minor seventh (octave)
                </li>
              </ul>
            </div>

            <div className="info-section">
              <h4>🎹 Available Chords</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="scale-badge">F Major</span>
                <span className="scale-badge">C Major</span>
                <span className="scale-badge">Bb Major</span>
                <span className="scale-badge">G Major</span>
                <span className="scale-badge">Dm</span>
                <span className="scale-badge">Dm7</span>
                <span className="scale-badge">Am</span>
                <span className="scale-badge">Fmaj7</span>
                <span className="scale-badge">Cmaj7</span>
                <span className="scale-badge">Bbmaj7</span>
                <span className="scale-badge">Fsus2</span>
                <span className="scale-badge">Csus4</span>
              </div>
            </div>

            <div className="info-section">
              <h4>✨ 432Hz Sacred Tuning</h4>
              <p>
                This handpan is tuned to 432Hz (A=432Hz), often called the "natural frequency" or "healing frequency."
                Many believe this tuning resonates with the natural vibration of the universe and promotes relaxation
                and spiritual connection.
              </p>
            </div>

            <div className="info-section">
              <h4>🎯 Playing Tips</h4>
              <ul>
                <li>Start with the center ding (D3) to establish the root</li>
                <li>Experiment with chord progressions: Dm → Bb → F → C</li>
                <li>Use the meditation modes for guided worship patterns</li>
                <li>Adjust reverb and delay for atmospheric soundscapes</li>
                <li>Record your patterns to create loops and compositions</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="bento-grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
        {/* Left column - Handpan + Configuration */}
        <div className="space-y-4">
          {/* Handpan Player on top */}
          <div className="bento-card">
            <div className="flex justify-center relative touch-none">
              <svg
                viewBox="0 0 800 800"
                className="w-full max-w-full md:max-w-2xl touch-none select-none"
                role="img"
                aria-label="Interactive Handpan Instrument"
              >
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
                  role="button"
                  aria-label={`Play center note ${handpanNotes.center.note} at ${handpanNotes.center.frequency.toFixed(1)} Hz`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      playNote(handpanNotes.center.frequency, handpanNotes.center.note, centerX, centerY)
                    }
                  }}
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
                    stroke="#8b5744"
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
                    className="fill-zinc-800 text-2xl md:text-3xl font-bold pointer-events-none"
                  >
                    {handpanNotes.center.note}
                  </text>
                  <text
                    x={centerX}
                    y={centerY + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-zinc-600 text-xs md:text-sm pointer-events-none"
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
                      role="button"
                      aria-label={`Play note ${noteData.note} at ${noteData.frequency.toFixed(1)} Hz, position ${noteData.position}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          playNote(noteData.frequency, noteData.note, pos.x, pos.y)
                        }
                      }}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={noteRadius}
                        data-highlighted={isHighlighted}
                        fill={
                          isHighlighted
                            ? activeChord && chordDefinitions[activeChord]
                              ? chordDefinitions[activeChord].color
                              : "#fbbf24"
                            : activeNote === noteData.note
                              ? "#fbbf24"
                              : "#d4a574"
                        }
                        stroke="#8b5744"
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
                        className="fill-zinc-800 text-sm md:text-base font-bold pointer-events-none"
                      >
                        {noteData.note}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y + 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-zinc-600 text-[10px] md:text-sm pointer-events-none"
                      >
                        {noteData.position}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <div className="preview-controls flex flex-wrap gap-2 md:gap-3 justify-center">
            <Button
              onClick={playScale}
              className="preview-btn gap-2 control-btn flex-1 md:flex-none min-w-[120px] text-sm md:text-base"
            >
              ⚡ <span className="hidden sm:inline">Play </span>Scale
            </Button>
            <Button
              onClick={playPattern}
              className="preview-btn gap-2 control-btn flex-1 md:flex-none min-w-[120px] text-sm md:text-base"
              variant={isPlaying ? "destructive" : "default"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline">⏸️ </span>Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">▶️ </span>Play
                </>
              )}
            </Button>
            <Button
              onClick={toggleRecording}
              className="preview-btn gap-2 control-btn flex-1 md:flex-none min-w-[120px] text-sm md:text-base"
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? "⏹️ Stop" : "🔴 Record"}
            </Button>
          </div>

          <div className="bento-card">
            <h4 className="text-lg font-semibold mb-4">Configuration</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Frequency Tuning */}
              <div>
                <label className="text-sm font-medium mb-2 block">Frequency Tuning</label>
                <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                  <option>432Hz (Sacred)</option>
                  <option>440Hz (Standard)</option>
                </select>
              </div>

              {/* Scale Pattern */}
              <div>
                <label className="text-sm font-medium mb-2 block">Scale Pattern</label>
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

              {/* Note Layout - Horizontal scrollable */}
              <div>
                <label className="text-sm font-medium mb-2 block">Note Layout</label>
                <div className="note-list-horizontal flex gap-2 overflow-x-auto pb-2">
                  <div className="note-config-compact flex-shrink-0 px-3 py-2 rounded bg-white/5 border border-white/10">
                    <span className="font-medium text-sm">{handpanNotes.center.note}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {handpanNotes.center.frequency.toFixed(0)}Hz
                    </span>
                  </div>
                  {handpanNotes.outerRing.map((note) => (
                    <div
                      key={note.note}
                      className="note-config-compact flex-shrink-0 px-3 py-2 rounded bg-white/5 border border-white/10"
                    >
                      <span className="font-medium text-sm">{note.note}</span>
                      <span className="text-xs text-muted-foreground ml-2">{note.frequency.toFixed(0)}Hz</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Sound Properties */}
        <div className="bento-card space-y-4">
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
              <p className="text-xs mt-2 text-shadow-strong bg-black/15 px-2 py-1 rounded">
                Select a pattern and click Play to see notes illuminate on the handpan
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="text-sm font-medium mb-2 block text-shadow-strong bg-black/20 px-3 py-2 rounded-lg">
                Chord Pads
              </label>
              <p className="text-xs mb-3 text-shadow-strong bg-black/15 px-2 py-1 rounded">
                <span className="hidden md:inline">Click to play • Right-click for variations</span>
                <span className="md:hidden">Tap to play • Long-press for variations</span>
              </p>
              <div className="grid grid-cols-3 gap-2 chord-grid-mobile">
                {Object.entries(chordDefinitions)
                  .slice(0, 12)
                  .map(([key, chord]) => (
                    <Button
                      key={key}
                      onClick={() => playChord(key)}
                      onContextMenu={(e) => handleChordRightClick(e, key)}
                      variant={activeChord === key ? "default" : "outline"}
                      className="text-xs md:text-sm h-14 md:h-16 flex flex-col items-center justify-center font-bold shadow-lg chord-button-mobile"
                      style={{
                        backgroundColor: activeChord === key ? chord.color : "rgba(255, 255, 255, 0.9)",
                        borderColor: chord.color,
                        borderWidth: "2px",
                        color: activeChord === key ? "white" : "#1f2937",
                      }}
                    >
                      <span className="font-bold text-base md:text-lg">{key}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{chord.name.split(" ")[1]}</span>
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showChordModal && selectedChordForVariations && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4"
          data-modal="chord-variations"
          onClick={handleModalClose}
        >
          <Card
            className="glass-card max-w-2xl w-full mobile-modal max-h-[85vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleModalClose}
              onMouseDown={handleModalClose}
              onTouchEnd={handleModalClose}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg"
              aria-label="Close modal"
            >
              <span className="text-xl font-bold">✕</span>
            </button>

            <CardHeader>
              <CardTitle>Chord Variations: {selectedChordForVariations}</CardTitle>
              <CardDescription>Explore different voicings and extensions - Click to play</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(chordDefinitions)
                  .filter(([key]) => {
                    const baseNote = selectedChordForVariations.replace(/[^A-G#b]/g, "")
                    return key.startsWith(baseNote)
                  })
                  .map(([key, chord]) => (
                    <Button
                      key={key}
                      onClick={() => {
                        console.log("[v0] 🎵 Chord variation clicked:", key)
                        playChord(key)
                        setShowChordModal(false)
                      }}
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-start gap-2 hover:bg-white/10"
                      style={{ borderColor: chord.color, borderWidth: "2px" }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xl">{key}</span>
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: chord.color, color: "white" }}
                        >
                          {chord.name}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Notes to play:</p>
                        <div className="flex gap-1 flex-wrap">
                          {chord.notes.map((note, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-mono font-bold px-2 py-1 rounded bg-white/10 border border-white/20"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
