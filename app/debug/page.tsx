"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DebugPage() {
  const [audioStatus, setAudioStatus] = useState("Not tested")
  const [clickStatus, setClickStatus] = useState("Not tested")

  const testMinimalAudio = async () => {
    try {
      setAudioStatus("Testing...")
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      osc.frequency.value = 440
      osc.connect(ctx.destination)
      osc.start()
      setTimeout(() => {
        osc.stop()
        setAudioStatus("✅ Audio works!")
      }, 500)
    } catch (error) {
      setAudioStatus(`❌ Error: ${error}`)
    }
  }

  const testDKurdNote = async () => {
    try {
      setAudioStatus("Testing D Kurd...")
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      osc.frequency.value = 144.548 // D3 at 432Hz
      osc.connect(ctx.destination)
      osc.start()
      setTimeout(() => {
        osc.stop()
        setAudioStatus("✅ D Kurd note works!")
      }, 1000)
    } catch (error) {
      setAudioStatus(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Debug Test Page</h1>

        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Audio Tests</h2>

          <div className="space-y-2">
            <Button onClick={testMinimalAudio} className="w-full">
              Test 1: Play 440Hz Tone
            </Button>
            <p className="text-sm text-muted-foreground">Status: {audioStatus}</p>
          </div>

          <div className="space-y-2">
            <Button onClick={testDKurdNote} className="w-full" variant="secondary">
              Test 2: Play D Kurd Note (D3 @ 432Hz)
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => {
                setClickStatus("✅ Click works!")
                console.log("[v0] Button clicked successfully")
              }}
              className="w-full"
              variant="outline"
            >
              Test 3: Simple Click Handler
            </Button>
            <p className="text-sm text-muted-foreground">Status: {clickStatus}</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Test 1" - You should hear a 440Hz beep for 0.5 seconds</li>
            <li>Click "Test 2" - You should hear a D note for 1 second</li>
            <li>Click "Test 3" - Status should change to "Click works!"</li>
            <li>Open browser console (F12) to see debug logs</li>
          </ol>
        </Card>

        <div className="flex gap-4">
          <Button asChild>
            <a href="/">← Back to Main App</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
