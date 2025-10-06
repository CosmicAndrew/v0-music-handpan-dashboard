// Mobile Audio Optimization for iOS Safari and Android Chrome
// Handles unlock, low-latency setup, and 432Hz tuning preservation

import * as Tone from "tone"

export class MobileAudioEngine {
  private static instance: MobileAudioEngine | null = null
  private audioContext: AudioContext | null = null
  private isUnlocked: boolean = false
  private iOSUnlockBuffer: AudioBuffer | null = null
  private userGestureCallbacks: (() => void)[] = []

  private constructor() {}

  static getInstance(): MobileAudioEngine {
    if (!MobileAudioEngine.instance) {
      MobileAudioEngine.instance = new MobileAudioEngine()
    }
    return MobileAudioEngine.instance
  }

  // Initialize audio context with optimal settings for mobile
  async initializeAudioContext(): Promise<void> {
    if (this.audioContext) return

    try {
      // Detect iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)

      // Configure for lowest possible latency
      const contextOptions: AudioContextOptions = {
        latencyHint: isIOS ? 'interactive' : 'playback',
        sampleRate: isIOS ? 44100 : 48000, // iOS prefers 44.1kHz, Android 48kHz
      }

      // Use webkitAudioContext for older iOS versions
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContextClass(contextOptions)

      // Configure Tone.js to use our optimized context
      await Tone.setContext(this.audioContext as any)

      // iOS-specific optimizations
      if (isIOS) {
        // Create silent buffer for iOS unlock
        this.iOSUnlockBuffer = this.audioContext.createBuffer(1, 1, 44100)
        
        // Set up iOS audio session category (via Web Audio API hints)
        if ('audioSession' in navigator) {
          try {
            await (navigator as any).audioSession.type = 'playback'
          } catch (e) {
            console.log('[Mobile Audio] AudioSession API not available')
          }
        }
      }

      // Android-specific optimizations
      if (isAndroid) {
        // Request low-latency audio playback
        if ('requestWakeLock' in navigator) {
          try {
            await (navigator as any).requestWakeLock('screen')
          } catch (e) {
            console.log('[Mobile Audio] Wake lock not available')
          }
        }
      }

      console.log('[Mobile Audio] Context initialized:', {
        sampleRate: this.audioContext.sampleRate,
        baseLatency: (this.audioContext as any).baseLatency || 'unknown',
        outputLatency: (this.audioContext as any).outputLatency || 'unknown',
      })
    } catch (error) {
      console.error('[Mobile Audio] Failed to initialize context:', error)
      throw error
    }
  }

  // Unlock audio context on user gesture (required for mobile browsers)
  async unlockAudioContext(): Promise<void> {
    if (this.isUnlocked || !this.audioContext) return

    try {
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // iOS requires playing a silent buffer to unlock
      if (this.iOSUnlockBuffer) {
        const source = this.audioContext.createBufferSource()
        source.buffer = this.iOSUnlockBuffer
        source.connect(this.audioContext.destination)
        source.start(0)
      }

      // Start Tone.js transport
      if (Tone.Transport.state === 'stopped') {
        await Tone.start()
      }

      this.isUnlocked = true
      console.log('[Mobile Audio] Audio context unlocked')

      // Execute any pending callbacks
      this.userGestureCallbacks.forEach(cb => cb())
      this.userGestureCallbacks = []
    } catch (error) {
      console.error('[Mobile Audio] Failed to unlock context:', error)
    }
  }

  // Register callback to execute after audio unlock
  onAudioUnlock(callback: () => void): void {
    if (this.isUnlocked) {
      callback()
    } else {
      this.userGestureCallbacks.push(callback)
    }
  }

  // Check if audio is ready for playback
  isReady(): boolean {
    return this.isUnlocked && 
           this.audioContext !== null && 
           this.audioContext.state === 'running'
  }

  // Get optimized buffer size for the platform
  getOptimalBufferSize(): number {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)

    // iOS performs best with smaller buffers
    if (isIOS) {
      return 256
    }
    
    // Android varies by device, use adaptive sizing
    if (isAndroid) {
      const memory = (navigator as any).deviceMemory || 4
      return memory >= 4 ? 512 : 1024
    }

    // Desktop browsers
    return 512
  }

  // Prepare audio buffers for instant playback
  async preloadHandpanSamples(): Promise<void> {
    if (!this.audioContext) return

    // Pre-warm the audio pipeline
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    gainNode.gain.value = 0 // Silent
    oscillator.frequency.value = 432 // 432Hz reference
    
    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.01)
    
    console.log('[Mobile Audio] Audio pipeline pre-warmed')
  }

  // Optimize for battery life on mobile
  enablePowerSaving(enable: boolean): void {
    if (!this.audioContext) return

    if (enable) {
      // Reduce processing when battery is low
      Tone.Transport.bpm.value = 60
      Tone.Master.volume.value = -6 // Reduce output level
      console.log('[Mobile Audio] Power saving mode enabled')
    } else {
      Tone.Transport.bpm.value = 120
      Tone.Master.volume.value = 0
      console.log('[Mobile Audio] Power saving mode disabled')
    }
  }

  // Handle visibility changes (backgrounding)
  handleVisibilityChange(isVisible: boolean): void {
    if (!this.audioContext) return

    if (!isVisible) {
      // App backgrounded - suspend non-essential audio
      if (this.audioContext.state === 'running') {
        // Keep context alive but reduce activity
        Tone.Transport.pause()
      }
    } else {
      // App foregrounded - resume audio
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      if (Tone.Transport.state === 'paused') {
        Tone.Transport.start()
      }
    }
  }

  // Clean up resources
  async dispose(): Promise<void> {
    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }
    this.isUnlocked = false
    this.userGestureCallbacks = []
    MobileAudioEngine.instance = null
  }

  // Get current audio stats for monitoring
  getAudioStats(): {
    latency: number
    sampleRate: number
    state: string
    currentTime: number
  } | null {
    if (!this.audioContext) return null

    return {
      latency: (this.audioContext as any).baseLatency || 0,
      sampleRate: this.audioContext.sampleRate,
      state: this.audioContext.state,
      currentTime: this.audioContext.currentTime,
    }
  }
}

// Touch event optimization for handpan notes
export class TouchOptimizer {
  private touchStartTime: Map<string, number> = new Map()
  private touchVelocity: Map<string, number> = new Map()
  private activeTouches: Map<string, Touch> = new Map()

  // Process touch start for velocity calculation
  handleTouchStart(noteId: string, touch: Touch): void {
    this.touchStartTime.set(noteId, performance.now())
    this.activeTouches.set(noteId, touch)
    
    // Calculate touch force if available (iOS 3D Touch / Force Touch)
    if ('force' in touch && touch.force > 0) {
      // Normalize force to velocity (0-127 MIDI range)
      const velocity = Math.min(127, Math.floor(touch.force * 127))
      this.touchVelocity.set(noteId, velocity)
    } else {
      // Default velocity for devices without pressure sensing
      this.touchVelocity.set(noteId, 80)
    }
  }

  // Calculate velocity based on touch duration (for tap vs press)
  handleTouchEnd(noteId: string): number {
    const startTime = this.touchStartTime.get(noteId)
    if (!startTime) return 80 // Default velocity

    const duration = performance.now() - startTime
    let velocity = this.touchVelocity.get(noteId) || 80

    // Quick taps = higher velocity, long press = lower velocity
    if (duration < 100) {
      velocity = Math.min(127, velocity * 1.2)
    } else if (duration > 500) {
      velocity = Math.max(40, velocity * 0.7)
    }

    // Cleanup
    this.touchStartTime.delete(noteId)
    this.touchVelocity.delete(noteId)
    this.activeTouches.delete(noteId)

    return Math.floor(velocity)
  }

  // Get all active touches for multi-touch support
  getActiveTouches(): string[] {
    return Array.from(this.activeTouches.keys())
  }

  // Clear all touch data
  clearAll(): void {
    this.touchStartTime.clear()
    this.touchVelocity.clear()
    this.activeTouches.clear()
  }
}

// Haptic feedback manager
export class HapticFeedback {
  private canVibrate: boolean = false

  constructor() {
    this.canVibrate = 'vibrate' in navigator
  }

  // Play haptic feedback for note strike
  playNoteStrike(intensity: 'light' | 'medium' | 'heavy' = 'medium'): void {
    if (!this.canVibrate) return

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 20],
    }

    navigator.vibrate(patterns[intensity])
  }

  // Play success feedback
  playSuccess(): void {
    if (!this.canVibrate) return
    navigator.vibrate([50, 30, 50])
  }

  // Play error feedback
  playError(): void {
    if (!this.canVibrate) return
    navigator.vibrate([100, 50, 100])
  }

  // Stop all vibration
  stop(): void {
    if (!this.canVibrate) return
    navigator.vibrate(0)
  }
}

// Export singleton instances
export const mobileAudio = MobileAudioEngine.getInstance()
export const touchOptimizer = new TouchOptimizer()
export const hapticFeedback = new HapticFeedback()