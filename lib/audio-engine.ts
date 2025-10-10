"use client"

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

export interface AudioEngineSettings {
  volume: number
  reverb: number
  sustain: number
  attack: number
  release: number
}

export class HandpanAudioEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private reverbNode: ConvolverNode | null = null
  private delayNode: DelayNode | null = null
  private delayFeedback: GainNode | null = null
  private compressor: DynamicsCompressorNode | null = null
  private initialized = false
  private settings: AudioEngineSettings = {
    volume: 0.85,
    reverb: 0.5,
    sustain: 0.7,
    attack: 0.01,
    release: 3.0,
  }

  async initialize() {
    if (this.initialized) {
      console.log("[v0] Audio engine already initialized")
      return
    }

    try {
      console.log("[v0] Creating AudioContext...")
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      console.log("[v0] AudioContext created, state:", this.audioContext.state)

      console.log("[v0] Creating audio nodes...")

      // Create master gain
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.settings.volume
      console.log("[v0] Master gain created, volume:", this.settings.volume)

      // Create compressor for dynamic range control
      this.compressor = this.audioContext.createDynamicsCompressor()
      this.compressor.threshold.value = -24
      this.compressor.knee.value = 30
      this.compressor.ratio.value = 12
      this.compressor.attack.value = 0.003
      this.compressor.release.value = 0.25
      console.log("[v0] Compressor created")

      // Create reverb with impulse response
      this.reverbNode = this.audioContext.createConvolver()
      await this.createReverbImpulse()
      console.log("[v0] Reverb node created")

      // Connect audio graph: reverb -> compressor -> master
      this.reverbNode.connect(this.compressor)
      this.compressor.connect(this.masterGain)
      this.masterGain.connect(this.audioContext.destination)
      console.log("[v0] Audio graph connected")

      this.initialized = true
      console.log("[v0] ✅ Enhanced audio engine initialized with reverb and compression")
    } catch (error) {
      console.error("[v0] ❌ Failed to initialize audio engine:", error)
      console.error("[v0] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
      throw error
    }
  }

  private async createReverbImpulse() {
    if (!this.audioContext || !this.reverbNode) return

    // Create artificial reverb impulse response
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * 3 // 3 second reverb
    const impulse = this.audioContext.createBuffer(2, length, sampleRate)
    const leftChannel = impulse.getChannelData(0)
    const rightChannel = impulse.getChannelData(1)

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (sampleRate * 0.5))
      leftChannel[i] = (Math.random() * 2 - 1) * decay
      rightChannel[i] = (Math.random() * 2 - 1) * decay
    }

    this.reverbNode.buffer = impulse
  }

  playNote(frequency: number, note: string, position?: { x: number; y: number }, duration?: number): void {
    if (!this.audioContext || !this.initialized) {
      console.warn("[v0] ⚠️ Audio engine not initialized, cannot play note")
      console.warn("[v0] State:", {
        hasContext: !!this.audioContext,
        initialized: this.initialized,
        contextState: this.audioContext?.state,
      })
      return
    }

    console.log("[v0] 🎵 Playing note:", note, "at", frequency, "Hz")
    console.log("[v0] Audio context state:", this.audioContext.state)

    const now = this.audioContext.currentTime
    const sustainTime = duration || this.settings.sustain * 4

    // Create oscillator for fundamental frequency
    const osc = this.audioContext.createOscillator()
    osc.frequency.value = frequency
    osc.type = "sine"

    // Create panner for spatial audio based on position
    const panner = this.audioContext.createStereoPanner()
    if (position) {
      // Map x position to stereo field (-1 to 1)
      const panValue = ((position.x - 400) / 400) * 0.5 // Subtle panning
      panner.pan.value = Math.max(-1, Math.min(1, panValue))
    }

    // Create main envelope gain
    const envelopeGain = this.audioContext.createGain()

    // Connect oscillator with gain level
    osc.connect(envelopeGain)

    // ADSR Envelope
    envelopeGain.gain.setValueAtTime(0, now)
    envelopeGain.gain.linearRampToValueAtTime(this.settings.volume * 0.8, now + this.settings.attack)
    envelopeGain.gain.exponentialRampToValueAtTime(this.settings.volume * 0.5, now + this.settings.attack + 0.1)
    envelopeGain.gain.exponentialRampToValueAtTime(0.01, now + sustainTime)

    // Connect to effects
    envelopeGain.connect(panner)
    panner.connect(this.reverbNode!)

    // Start and stop oscillator
    osc.start(now)
    osc.stop(now + sustainTime)
  }

  playChord(frequencies: number[], notes: string[], duration?: number): void {
    if (!this.audioContext || !this.initialized) return

    // Play each note in the chord with slight timing offset for natural feel
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playNote(freq, notes[index], undefined, duration)
      }, index * 50) // 50ms stagger
    })

    console.log("[v0] Playing chord with notes:", notes.join(", "))
  }

  updateSettings(settings: Partial<AudioEngineSettings>): void {
    this.settings = { ...this.settings, ...settings }

    if (this.masterGain && settings.volume !== undefined) {
      this.masterGain.gain.value = settings.volume
    }

    console.log("[v0] Audio settings updated:", this.settings)
  }

  setVolume(value: number): void {
    this.updateSettings({ volume: value / 100 })
  }

  setReverb(value: number): void {
    this.updateSettings({ reverb: value / 100 })
  }

  setSustain(value: number): void {
    this.updateSettings({ sustain: value / 100 })
  }

  getSettings(): AudioEngineSettings {
    return { ...this.settings }
  }

  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume()
      console.log("[v0] Audio context resumed")
    }
  }

  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.initialized = false
    console.log("[v0] Audio engine disposed")
  }
}

// Singleton instance
export const audioEngine = new HandpanAudioEngine()
