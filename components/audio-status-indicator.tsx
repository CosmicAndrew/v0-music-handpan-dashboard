"use client"

import React, { useEffect, useState } from "react"
import { Volume2, VolumeX } from "@/components/icons"

interface AudioStatusIndicatorProps {
  isReady: boolean
  isMuted?: boolean
  className?: string
}

export function AudioStatusIndicator({
  isReady,
  isMuted = false,
  className = "",
}: AudioStatusIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(true)

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setShowIndicator(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowIndicator(true)
    }
  }, [isReady])

  if (!showIndicator && isReady) return null

  return (
    <div
      className={`fixed top-20 right-4 z-40 transition-all duration-300 ${
        isReady ? 'opacity-75' : 'opacity-100'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="glass-surface rounded-full px-4 py-2 shadow-lg border border-white/20 flex items-center gap-2">
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-red-400" />
        ) : isReady ? (
          <Volume2 className="w-4 h-4 text-green-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-yellow-400 animate-pulse" />
        )}
        <span className="text-xs text-white font-medium">
          {isMuted ? 'Muted' : isReady ? 'Audio Ready' : 'Tap to enable audio'}
        </span>
      </div>
    </div>
  )
}
