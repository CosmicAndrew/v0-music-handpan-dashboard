"use client"

import { useState, useEffect, useRef } from "react"

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const isRefreshing = useRef(false)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing.current) {
        const currentY = e.touches[0].clientY
        const distance = currentY - startY.current

        if (distance > 0) {
          setIsPulling(true)
          setPullDistance(Math.min(distance, 100))
        }
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance > 60 && !isRefreshing.current) {
        isRefreshing.current = true
        await onRefresh()
        isRefreshing.current = false
      }
      setIsPulling(false)
      setPullDistance(0)
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pullDistance, onRefresh])

  return { isPulling, pullDistance }
}
