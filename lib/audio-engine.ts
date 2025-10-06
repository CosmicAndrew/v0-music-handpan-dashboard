"use client"

import * as Tone from "tone"

// Exact YataoPan D Kurd 10 frequencies at 432Hz
export const handpanFrequencies = {
  center: { note: "D3", frequency: 144.548, position: "dome" },
  outerRing: [
    { note: "A3", frequency: 216.0, position: "6:00", angle: 0 },
    { note: "Bb3", frequency: 228.874, position: "7:30", angle: 45 },
    { note: "D4", frequency: 288.0, position: "9:00", angle: 90 },
    { note: "F4", frequency: 342.338, position: "10:30", angle: 135 },
    { note: "A4", frequency: 432.0, position: "12:00", angle: 180 },
    { note: "C5", frequency: 514.864, position: "1:30", angle: 225 },
    { note: "G4", frequency: 384.444, position: "3:00", angle: 270 },
    { note: "E4", frequency: 323.551, position: "4:30", angle: 315 },
    { note: "C4", frequency: 257.432, position: "6:00", angle: 360 },
  ],
}

export class HandpanAudioEngine {
  private synth: Tone.PolySynth | null = null
  private metronome: Tone.Loop | null = null
  private droneOscillator: Tone.Oscillator | null = null
  private initialized = false
  private metronomeBPM = 80
  private metronomeActive = false

  async initialize() {
    if (this.initialized) return

    try {
      await Tone.start()

      // Create handpan-like synth with metallic timbre
      this.synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3.01,
        modulationIndex: 14,
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.01,
          decay: 2.0,
          sustain: 0.1,
          release: 3.0,
        },
        modulation: { type: "square" },
        modulationEnvelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0,
          release: 0.2,
        },
      }).toDestination()

      this.synth.volume.value = -8

      this.initialized = true
      console.log("[v0] Handpan audio engine initialized successfully")
    } catch (error) {
      console.error("[v0] Failed to initialize audio engine:", error)
      throw error
    }
  }

  playNote(frequency: number, duration = "8n") {
    if (!this.synth || !this.initialized) {
      console.warn("[v0] Audio engine not initialized")
      return
    }

    try {
      this.synth.triggerAttackRelease(frequency, duration, Tone.now())
    } catch (error) {
      console.error("[v0] Failed to play note:", error)
    }
  }

  playChord(notes: string[] | number[], duration = "2n") {
    if (!this.synth || !this.initialized) return

    try {
      this.synth.triggerAttackRelease(notes, duration, Tone.now())
    } catch (error) {
      console.error("[v0] Failed to play chord:", error)
    }
  }

  startMetronome(bpm = 80) {
    if (this.metronomeActive) return

    this.metronomeBPM = bpm
    Tone.Transport.bpm.value = bpm

    const clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0,
      },
    }).toDestination()

    this.metronome = new Tone.Loop((time) => {
      clickSynth.triggerAttackRelease("C5", "32n", time)
    }, "4n")

    this.metronome.start(0)
    Tone.Transport.start()
    this.metronomeActive = true
  }

  stopMetronome() {
    if (this.metronome) {
      this.metronome.stop()
      this.metronome.dispose()
      this.metronome = null
    }
    Tone.Transport.stop()
    this.metronomeActive = false
  }

  startDrone(frequency: number) {
    if (this.droneOscillator) {
      this.stopDrone()
    }

    this.droneOscillator = new Tone.Oscillator({
      frequency,
      type: "sine",
      volume: -20,
    }).toDestination()

    this.droneOscillator.start()
  }

  stopDrone() {
    if (this.droneOscillator) {
      this.droneOscillator.stop()
      this.droneOscillator.dispose()
      this.droneOscillator = null
    }
  }

  setVolume(value: number) {
    if (this.synth) {
      this.synth.volume.value = value
    }
  }

  dispose() {
    this.stopMetronome()
    this.stopDrone()
    if (this.synth) {
      this.synth.dispose()
    }
  }
}

export const audioEngine = new HandpanAudioEngine()
