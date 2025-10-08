"use client"

import { useState, useEffect } from "react"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      console.log("[useOffline] Connection restored")
      setIsOnline(true)
      setWasOffline(true)

      // Clear the "was offline" flag after 3 seconds
      setTimeout(() => setWasOffline(false), 3000)
    }

    const handleOffline = () => {
      console.log("[useOffline] Connection lost")
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}
