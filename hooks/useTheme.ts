"use client"

import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  const { theme, setTheme } = useNextTheme()

  // Additional functionality can be added here if needed

  return { theme, setTheme }
}
