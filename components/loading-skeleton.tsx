"use client"

import React from "react"

interface LoadingSkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular" | "rounded"
  width?: string | number
  height?: string | number
}

export function LoadingSkeleton({
  className = "",
  variant = "rectangular",
  width = "100%",
  height = "1rem",
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
  
  const variantClasses = {
    text: "rounded-sm",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-xl",
  }

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  )
}

export function HandpanLoadingSkeleton() {
  return (
    <div className="relative min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <LoadingSkeleton width="60%" height="2rem" variant="text" />
          <LoadingSkeleton width="40%" height="1rem" variant="text" />
        </div>

        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <LoadingSkeleton variant="circular" width={400} height={400} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading handpan...</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <LoadingSkeleton height="4rem" variant="rounded" />
          <LoadingSkeleton height="4rem" variant="rounded" />
        </div>
      </div>
    </div>
  )
}

export function SongLibraryLoadingSkeleton() {
  return (
    <div className="relative min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <LoadingSkeleton width="50%" height="2rem" variant="text" />
        
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} width="8rem" height="2.5rem" variant="rounded" />
          ))}
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingSkeleton key={i} height="5rem" variant="rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
