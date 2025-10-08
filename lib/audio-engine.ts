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
  delay: number
  sustain: number
  attack: number
  release: number
  harmonics: number
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
    volume: 0.7,
    reverb: 0.5,
    delay: 0.3,
    sustain: 0.7,
    attack: 0.01,
    release: 3.0,
    harmonics: 0.3,
  }

  async initialize() {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create master gain
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.settings.volume

      // Create compressor for dynamic range control
      this.compressor = this.audioContext.createDynamicsCompressor()
      this.compressor.threshold.value = -24
      this.compressor.knee.value = 30
      this.compressor.ratio.value = 12
      this.compressor.attack.value = 0.003
      this.compressor.release.value = 0.25

      // Create reverb with impulse response
      this.reverbNode = this.audioContext.createConvolver()
      await this.createReverbImpulse()

      // Create delay effect
      this.delayNode = this.audioContext.createDelay(2.0)
      this.delayNode.delayTime.value = 0.3

      this.delayFeedback = this.audioContext.createGain()
      this.delayFeedback.gain.value = this.settings.delay

      // Connect delay feedback loop
      this.delayNode.connect(this.delayFeedback)
      this.delayFeedback.connect(this.delayNode)

      // Connect audio graph: reverb + delay -> compressor -> master
      this.reverbNode.connect(this.compressor)
      this.delayNode.connect(this.compressor)
      this.compressor.connect(this.masterGain)
      this.masterGain.connect(this.audioContext.destination)

      this.initialized = true
      console.log("[v0] Enhanced audio engine initialized with reverb, delay, and compression")
    } catch (error) {
      console.error("[v0] Failed to initialize audio engine:", error)
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
      console.warn("[v0] Audio engine not initialized")
      return
    }

    const now = this.audioContext.currentTime
    const sustainTime = duration || this.settings.sustain * 4

    // Create multiple oscillators for rich harmonic content
    const oscillators: OscillatorNode[] = []
    const gains: GainNode[] = []

    // Fundamental frequency
    const osc1 = this.audioContext.createOscillator()
    const gain1 = this.audioContext.createGain()
    osc1.frequency.value = frequency
    osc1.type = "sine"
    oscillators.push(osc1)
    gains.push(gain1)

    // Second harmonic (octave)
    const osc2 = this.audioContext.createOscillator()
    const gain2 = this.audioContext.createGain()
    osc2.frequency.value = frequency * 2
    osc2.type = "sine"
    oscillators.push(osc2)
    gains.push(gain2)

    // Third harmonic (perfect fifth above octave)
    const osc3 = this.audioContext.createOscillator()
    const gain3 = this.audioContext.createGain()
    osc3.frequency.value = frequency * 3
    osc3.type = "sine"
    oscillators.push(osc3)
    gains.push(gain3)

    // Create panner for spatial audio based on position
    const panner = this.audioContext.createStereoPanner()
    if (position) {
      // Map x position to stereo field (-1 to 1)
      const panValue = ((position.x - 400) / 400) * 0.5 // Subtle panning
      panner.pan.value = Math.max(-1, Math.min(1, panValue))
    }

    // Create main envelope gain
    const envelopeGain = this.audioContext.createGain()

    // Connect oscillators with different gain levels
    oscillators.forEach((osc, index) => {
      const gain = gains[index]
      const level = index === 0 ? 0.6 : this.settings.harmonics * (0.3 / (index + 1))
      gain.gain.value = level

      osc.connect(gain)
      gain.connect(envelopeGain)
    })

    // ADSR Envelope
    envelopeGain.gain.setValueAtTime(0, now)
    envelopeGain.gain.linearRampToValueAtTime(this.settings.volume * 0.8, now + this.settings.attack)
    envelopeGain.gain.exponentialRampToValueAtTime(this.settings.volume * 0.5, now + this.settings.attack + 0.1)
    envelopeGain.gain.exponentialRampToValueAtTime(0.01, now + sustainTime)

    // Connect to effects
    envelopeGain.connect(panner)
    panner.connect(this.reverbNode!)
    panner.connect(this.delayNode!)

    // Start and stop oscillators
    oscillators.forEach((osc) => {
      osc.start(now)
      osc.stop(now + sustainTime)
    })

    console.log("[v0] Playing note:", note, "at", frequency, "Hz with", oscillators.length, "harmonics")
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

    if (this.delayFeedback && settings.delay !== undefined) {
      this.delayFeedback.gain.value = settings.delay
    }

    console.log("[v0] Audio settings updated:", this.settings)
  }

  setVolume(value: number): void {
    this.updateSettings({ volume: value / 100 })
  }

  setReverb(value: number): void {
    this.updateSettings({ reverb: value / 100 })
  }

  setDelay(value: number): void {
    this.updateSettings({ delay: value / 100 })
  }

  setSustain(value: number): void {
    this.updateSettings({ sustain: value / 100 })
  }

  setHarmonics(value: number): void {
    this.updateSettings({ harmonics: value / 100 })
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
