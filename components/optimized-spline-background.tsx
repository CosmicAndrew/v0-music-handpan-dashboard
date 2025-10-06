"use client"

import React, { useEffect, useState, useRef } from "react"

interface OptimizedSplineBackgroundProps {
  className?: string
}

export function OptimizedSplineBackground({ className = "" }: OptimizedSplineBackgroundProps) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(userAgent)
      setIsMobile(width < 768 || isMobileDevice)
    }

    checkMobile()

    const prefersReducedMotion = window.matchMedia('(prefers-color-scheme: reduce)').matches
    
    if (prefersReducedMotion || (isMobile && navigator.connection && navigator.connection.saveData)) {
      return
    }

    window.addEventListener('resize', checkMobile)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true)
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [shouldLoad, isMobile])

  const splineUrl = `https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY${isMobile ? '?quality=low' : ''}`

  return (
    <div
      ref={containerRef}
      className={`spline-container absolute top-0 left-0 w-full h-full -z-10 ${className}`}
    >
      {shouldLoad ? (
        <iframe
          src={splineUrl}
          frameBorder="0"
          width="100%"
          height="100%"
          title="3D Background"
          loading="lazy"
          style={{
            pointerEvents: 'none',
            opacity: 0,
            animation: 'fadeIn 0.5s ease-in forwards',
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-50/50 to-indigo-100/50" />
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
