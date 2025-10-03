"use client"

import { useEffect, useState, useRef } from "react"
import { Play, Pause, Volume2, Settings } from "@/components/icons"
import { audioEngine, handpanFrequencies } from "@/lib/audio-engine"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function HandpanPlayer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [volume, setVolume] = useState(70)
  const [metronomeActive, setMetronomeActive] = useState(false)
  const [bpm, setBpm] = useState(80)
  const [droneActive, setDroneActive] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioEngine.initialize()
        setIsInitialized(true)
      } catch (error) {
        console.error("[v0] Failed to initialize audio:", error)
      }
    }

    // Load saved preferences
    const savedVolume = localStorage.getItem("handpan-volume")
    const savedBpm = localStorage.getItem("handpan-bpm")

    if (savedVolume) setVolume(Number.parseInt(savedVolume))
    if (savedBpm) setBpm(Number.parseInt(savedBpm))

    return () => {
      audioEngine.dispose()
    }
  }, [])

  useEffect(() => {
    audioEngine.setVolume((volume - 100) / 5)
    localStorage.setItem("handpan-volume", volume.toString())
  }, [volume])

  const handleNoteClick = (note: string, frequency: number) => {
    if (!isInitialized) {
      audioEngine.initialize().then(() => {
        setIsInitialized(true)
        audioEngine.playNote(frequency)
      })
    } else {
      audioEngine.playNote(frequency)
    }

    setActiveNote(note)
    setTimeout(() => setActiveNote(null), 300)
  }

  const toggleMetronome = () => {
    if (metronomeActive) {
      audioEngine.stopMetronome()
      setMetronomeActive(false)
    } else {
      if (!isInitialized) {
        audioEngine.initialize().then(() => {
          setIsInitialized(true)
          audioEngine.startMetronome(bpm)
          setMetronomeActive(true)
        })
      } else {
        audioEngine.startMetronome(bpm)
        setMetronomeActive(true)
      }
    }
  }

  const toggleDrone = () => {
    if (droneActive) {
      audioEngine.stopDrone()
      setDroneActive(false)
    } else {
      if (!isInitialized) {
        audioEngine.initialize().then(() => {
          setIsInitialized(true)
          audioEngine.startDrone(handpanFrequencies.center.frequency)
          setDroneActive(true)
        })
      } else {
        audioEngine.startDrone(handpanFrequencies.center.frequency)
        setDroneActive(true)
      }
    }
  }

  const handleBpmChange = (value: number[]) => {
    const newBpm = value[0]
    setBpm(newBpm)
    localStorage.setItem("handpan-bpm", newBpm.toString())
    if (metronomeActive) {
      audioEngine.stopMetronome()
      audioEngine.startMetronome(newBpm)
    }
  }

  // Calculate SVG positions for outer ring notes
  const centerX = 400
  const centerY = 400
  const radius = 250

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      {/* Audio Controls */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Audio Controls</h3>
          <div className="flex gap-2">
            <Button
              variant={metronomeActive ? "default" : "outline"}
              size="sm"
              onClick={toggleMetronome}
              className="glass-button"
            >
              {metronomeActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              Metronome
            </Button>
            <Button
              variant={droneActive ? "default" : "outline"}
              size="sm"
              onClick={toggleDrone}
              className="glass-button"
            >
              Drone (D)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm flex items-center gap-2">
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
            <label className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              BPM: {bpm}
            </label>
            <Slider value={[bpm]} onValueChange={handleBpmChange} min={40} max={200} step={1} className="w-full" />
          </div>
        </div>
      </div>

      {/* Interactive Handpan SVG */}
      <div className="glass-card p-8">
        <svg
          ref={svgRef}
          viewBox="0 0 800 800"
          className="w-full h-auto max-w-2xl mx-auto cursor-pointer"
          style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))" }}
        >
          {/* Handpan body gradient */}
          <defs>
            <radialGradient id="handpanGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="50%" stopColor="#b8956a" />
              <stop offset="100%" stopColor="#8b6f47" />
            </radialGradient>
            <radialGradient id="noteGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#e8c9a0" />
              <stop offset="100%" stopColor="#a67c52" />
            </radialGradient>
          </defs>

          {/* Outer rim */}
          <circle cx={centerX} cy={centerY} r={320} fill="url(#handpanGradient)" stroke="#6b5742" strokeWidth="4" />

          {/* Center dome (D3) */}
          <g
            onClick={() => handleNoteClick(handpanFrequencies.center.note, handpanFrequencies.center.frequency)}
            className="cursor-pointer transition-transform hover:scale-105"
            style={{
              transform: activeNote === handpanFrequencies.center.note ? "scale(0.95)" : "scale(1)",
              transformOrigin: `${centerX}px ${centerY}px`,
            }}
          >
            <circle cx={centerX} cy={centerY} r={80} fill="url(#noteGradient)" stroke="#8b6f47" strokeWidth="3" />
            <circle cx={centerX} cy={centerY} r={60} fill="none" stroke="#a67c52" strokeWidth="2" opacity="0.5" />
            <text
              x={centerX}
              y={centerY + 8}
              textAnchor="middle"
              className="text-2xl font-bold fill-[#6b5742] select-none"
            >
              {handpanFrequencies.center.note}
            </text>
            <text x={centerX} y={centerY + 28} textAnchor="middle" className="text-xs fill-[#8b6f47] select-none">
              {handpanFrequencies.center.frequency.toFixed(2)} Hz
            </text>
          </g>

          {/* Outer ring notes */}
          {handpanFrequencies.outerRing.map((noteData, index) => {
            const angle = (noteData.angle - 90) * (Math.PI / 180)
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)

            return (
              <g
                key={noteData.note + index}
                onClick={() => handleNoteClick(noteData.note, noteData.frequency)}
                className="cursor-pointer transition-transform hover:scale-110"
                style={{
                  transform: activeNote === noteData.note ? "scale(0.9)" : "scale(1)",
                  transformOrigin: `${x}px ${y}px`,
                }}
              >
                <circle cx={x} cy={y} r={45} fill="url(#noteGradient)" stroke="#8b6f47" strokeWidth="2" />
                <circle cx={x} cy={y} r={32} fill="none" stroke="#a67c52" strokeWidth="1.5" opacity="0.4" />
                <text x={x} y={y + 6} textAnchor="middle" className="text-lg font-semibold fill-[#6b5742] select-none">
                  {noteData.note}
                </text>
                <text x={x} y={y + 20} textAnchor="middle" className="text-[10px] fill-[#8b6f47] select-none">
                  {noteData.frequency.toFixed(0)}
                </text>
              </g>
            )
          })}

          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 100}
            textAnchor="middle"
            className="text-sm font-light fill-[#d4a574] select-none tracking-widest"
          >
            D KURD 10 • A432
          </text>
        </svg>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Click any note to play • Touch-optimized for mobile
        </p>
      </div>
    </div>
  )
}
