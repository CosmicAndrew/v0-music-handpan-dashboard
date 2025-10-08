"use client"

import { useOffline } from "@/hooks/use-offline"
import { WifiOff, Wifi } from "@/components/icons"

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOffline()

  if (isOnline && !wasOffline) {
    return null
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
      }`}
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span className="font-semibold">Back Online!</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="font-semibold">You're Offline</span>
          </>
        )}
      </div>
    </div>
  )
}
