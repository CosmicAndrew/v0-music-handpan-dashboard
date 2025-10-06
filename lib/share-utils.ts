"use client"

export interface ShareData {
  title: string
  text: string
  url?: string
}

export async function shareContent(data: ShareData): Promise<boolean> {
  if (typeof navigator === 'undefined') return false

  if (navigator.share && navigator.canShare && navigator.canShare(data)) {
    try {
      await navigator.share(data)
      console.log('[Share] Content shared successfully')
      return true
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('[Share] Error sharing:', error)
      }
      return false
    }
  } else {
    if (navigator.clipboard) {
      try {
        const shareText = `${data.title}\n\n${data.text}${data.url ? `\n\n${data.url}` : ''}`
        await navigator.clipboard.writeText(shareText)
        console.log('[Share] Content copied to clipboard')
        return true
      } catch (error) {
        console.error('[Share] Error copying to clipboard:', error)
        return false
      }
    }
  }

  return false
}

export function canShare(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!(navigator.share || navigator.clipboard)
}

export function shareSong(songTitle: string, artist: string, key: string) {
  return shareContent({
    title: `${songTitle} - ${artist}`,
    text: `Check out this worship song on Handpan Worship! 🎵\n\n"${songTitle}" by ${artist}\nKey: ${key}\nTuned to 432 Hz for the handpan`,
    url: window.location.origin,
  })
}

export function shareApp() {
  return shareContent({
    title: 'Handpan Worship - 432 Hz',
    text: 'Experience worship through an interactive handpan tuned to 432 Hz! 🎶 Includes song library, devotional content, and authentic handpan interface.',
    url: window.location.origin,
  })
}
