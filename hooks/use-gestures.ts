"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export interface GestureHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onLongPress?: () => void
  onDoubleTap?: () => void
}

export interface GestureOptions {
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
  preventScroll?: boolean
}

export function useGestures(
  elementRef: React.RefObject<HTMLElement>,
  handlers: GestureHandlers,
  options: GestureOptions = {},
) {
  const { swipeThreshold = 50, longPressDelay = 500, doubleTapDelay = 300, preventScroll = false } = options

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTapRef = useRef<number>(0)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialPinchDistanceRef = useRef<number | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault()
      }

      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }

      // Handle pinch gesture
      if (e.touches.length === 2 && handlers.onPinch) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
        initialPinchDistanceRef.current = distance
      }

      // Handle long press
      if (handlers.onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          handlers.onLongPress?.()
          // Trigger haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(50)
          }
        }, longPressDelay)
      }

      // Handle double tap
      if (handlers.onDoubleTap) {
        const now = Date.now()
        if (now - lastTapRef.current < doubleTapDelay) {
          handlers.onDoubleTap()
          lastTapRef.current = 0
        } else {
          lastTapRef.current = now
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault()
      }

      // Cancel long press on move
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      // Handle pinch gesture
      if (e.touches.length === 2 && handlers.onPinch && initialPinchDistanceRef.current) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
        const scale = distance / initialPinchDistanceRef.current
        handlers.onPinch(scale)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault()
      }

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      // Reset pinch distance
      initialPinchDistanceRef.current = null

      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      // Only trigger swipe if it was fast enough (< 300ms)
      if (deltaTime < 300) {
        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)

        // Horizontal swipe
        if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
          if (deltaX > 0) {
            handlers.onSwipeRight?.()
          } else {
            handlers.onSwipeLeft?.()
          }
          // Trigger haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(10)
          }
        }
        // Vertical swipe
        else if (absDeltaY > swipeThreshold && absDeltaY > absDeltaX) {
          if (deltaY > 0) {
            handlers.onSwipeDown?.()
          } else {
            handlers.onSwipeUp?.()
          }
          // Trigger haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(10)
          }
        }
      }

      touchStartRef.current = null
    }

    element.addEventListener("touchstart", handleTouchStart, { passive: !preventScroll })
    element.addEventListener("touchmove", handleTouchMove, { passive: !preventScroll })
    element.addEventListener("touchend", handleTouchEnd, { passive: !preventScroll })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [handlers, swipeThreshold, longPressDelay, doubleTapDelay, preventScroll])
}

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startYRef = useRef<number>(0)
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshingRef.current || window.scrollY > 0) return

      const currentY = e.touches[0].clientY
      const distance = currentY - startYRef.current

      if (distance > 0) {
        setIsPulling(true)
        setPullDistance(Math.min(distance, 100))
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance > 60 && !isRefreshingRef.current) {
        isRefreshingRef.current = true
        try {
          await onRefresh()
          if (navigator.vibrate) {
            navigator.vibrate([10, 50, 10])
          }
        } finally {
          isRefreshingRef.current = false
        }
      }
      setIsPulling(false)
      setPullDistance(0)
      startYRef.current = 0
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pullDistance, onRefresh])

  return { isPulling, pullDistance }
}
