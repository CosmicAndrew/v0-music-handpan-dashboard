"use client"

import { useEffect } from "react"

export function ThemeHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const themeColor = isDark ? '#312e81' : '#4f46e5'
      
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute('content', themeColor)
      })
    }

    updateTheme()

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', updateTheme)
      return () => darkModeQuery.removeEventListener('change', updateTheme)
    } else {
      darkModeQuery.addListener(updateTheme)
      return () => darkModeQuery.removeListener(updateTheme)
    }
  }, [])

  return null
}
