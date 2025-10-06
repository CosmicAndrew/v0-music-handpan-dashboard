"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, RefreshCw, Wifi, WifiOff } from "lucide-react"

export function PWAManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000) // Check every hour

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error)
        })
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!isInstalled) {
        // Show install prompt after user has engaged with the app
        setTimeout(() => setShowInstallPrompt(true), 30000) // Show after 30 seconds
      }
    }

    // Handle online/offline status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Check if iOS and not installed
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS && !isInstalled) {
      // Show iOS-specific install instructions after some engagement
      setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowInstallPrompt(true)
        }
      }, 60000) // Show after 1 minute on iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS-specific instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        alert('To install: Tap the share button and select "Add to Home Screen"')
      }
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`[PWA] User response to install prompt: ${outcome}`)
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    
    // Clear the prompt
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleUpdate = () => {
    // Skip waiting and reload to activate new service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
          <Card className="bg-orange-500 text-white border-orange-600">
            <CardContent className="p-3 flex items-center gap-3">
              <WifiOff className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Offline Mode</p>
                <p className="text-xs opacity-90">You can still play the handpan</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Install prompt */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
          <Card className="glass-card border-white/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Install Handpan App</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Install for offline worship, faster loading, and home screen access
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleInstall}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    >
                      Install Now
                    </Button>
                    <Button
                      onClick={() => setShowInstallPrompt(false)}
                      size="sm"
                      variant="ghost"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Update prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
          <Card className="glass-card border-white/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Update Available</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    A new version of Handpan Worship Suite is ready
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdate}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    >
                      Update Now
                    </Button>
                    <Button
                      onClick={() => setShowUpdatePrompt(false)}
                      size="sm"
                      variant="ghost"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}