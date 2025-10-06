"use client"

import * as Tone from "tone"

export class MobileAudioManager {
  private static instance: MobileAudioManager
  private audioContextStarted = false
  private visibilityHandler: (() => void) | null = null

  static getInstance(): MobileAudioManager {
    if (!MobileAudioManager.instance) {
      MobileAudioManager.instance = new MobileAudioManager()
    }
    return MobileAudioManager.instance
  }

  /**
   * Initialize audio context on user gesture (required for iOS)
   */
  async initializeOnUserGesture(): Promise<boolean> {
    if (this.audioContextStarted) {
      return true
    }

    try {
      // Start Tone.js audio context
      await Tone.start()
      
      // Configure for mobile performance
      if (Tone.context.rawContext instanceof AudioContext) {
        // Set latencyHint for better mobile performance
        const context = Tone.context.rawContext
        
        // Resume context if suspended (iOS requirement)
        if (context.state === 'suspended') {
          await context.resume()
        }
      }

      this.audioContextStarted = true
      console.log("[Mobile Audio] Audio context initialized successfully")
      
      // Set up page visibility handling
      this.setupVisibilityHandling()
      
      return true
    } catch (error) {
      console.error("[Mobile Audio] Failed to initialize audio context:", error)
      return false
    }
  }

  /**
   * Handle page visibility changes (iOS backgrounds audio contexts)
   */
  private setupVisibilityHandling() {
    if (typeof document === 'undefined') return

    this.visibilityHandler = async () => {
      if (document.visibilityState === 'visible') {
        // Resume audio context when page becomes visible
        if (Tone.context.rawContext.state === 'suspended') {
          try {
            await Tone.context.rawContext.resume()
            console.log("[Mobile Audio] Audio context resumed")
          } catch (error) {
            console.error("[Mobile Audio] Failed to resume audio context:", error)
          }
        }
      } else {
        // Optional: suspend when hidden to save battery
        // Tone.context.rawContext.suspend()
      }
    }

    document.addEventListener('visibilitychange', this.visibilityHandler)
  }

  /**
   * Clean up event listeners
   */
  cleanup() {
    if (this.visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler)
      this.visibilityHandler = null
    }
  }

  /**
   * Check if we're on a mobile device
   */
  static isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(userAgent)
  }

  /**
   * Check if we're on iOS specifically
   */
  static isIOS(): boolean {
    if (typeof window === 'undefined') return false
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/i.test(userAgent)
  }

  /**
   * Get optimal audio context settings for mobile
   */
  static getMobileAudioSettings() {
    return {
      latencyHint: MobileAudioManager.isIOS() ? 'balanced' : 'interactive',
      sampleRate: 44100,
    }
  }
}
