"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Smartphone, Globe, Music, BarChart3, Check } from "lucide-react"

export function ExportProgress() {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)

  const exportOptions = [
    { id: "ios", icon: Smartphone, label: "iOS Worship App", description: "Native mobile experience" },
    { id: "web", icon: Globe, label: "Web Player", description: "Browser-based player" },
    { id: "audio", icon: Music, label: "Audio Setlist", description: "Export as playlist" },
    { id: "analytics", icon: BarChart3, label: "Practice Analytics", description: "Performance insights" },
  ]

  const progressItems = [
    { icon: Check, text: "Songs synchronized successfully", status: "Complete", color: "text-green-400" },
    { icon: Check, text: "Handpan frequencies calibrated", status: "Complete", color: "text-green-400" },
    { icon: Check, text: "Sacred content loaded", status: "Ready", color: "text-blue-400" },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="spline-container absolute top-0 left-0 w-full h-full -z-10">
        <iframe
          src="https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          title="3D Background"
        />
      </div>
      <div className="max-w-6xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 fade-up">
          <Badge variant="outline" className="glass-surface border-white/20 text-white/90">
            <Download className="w-3 h-3 mr-1" />
            Export System
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Export Your Worship System</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Choose your preferred format and start building your sacred music experience
          </p>
        </div>

        {/* Export Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Export Options Card */}
          <div className="cloudier-glass-elevated rounded-2xl p-8 space-y-6 fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Export Options</h3>
              <p className="text-white/60">Select your deployment format</p>
            </div>

            <div className="grid gap-4">
              {exportOptions.map((option) => {
                const Icon = option.icon
                const isSelected = selectedFormat === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFormat(option.id)}
                    className={`
                      glass-surface rounded-xl p-4 text-left transition-all duration-300
                      hover:scale-[1.02] hover:shadow-lg
                      ${isSelected ? "ring-2 ring-white/40 bg-white/10" : ""}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                        p-3 rounded-lg transition-colors
                        ${isSelected ? "bg-white/20" : "bg-white/10"}
                      `}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{option.label}</h4>
                        <p className="text-sm text-white/60">{option.description}</p>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-green-400" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <Button
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20"
              size="lg"
              disabled={!selectedFormat}
            >
              <Download className="w-4 h-4 mr-2" />
              Ready to Export
            </Button>
          </div>

          {/* Progress Card */}
          <div className="cloudier-glass-elevated rounded-2xl p-8 space-y-6 fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Build Progress</h3>
              <p className="text-white/60">System status and readiness</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-surface rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">40</div>
                <div className="text-sm text-white/60">Songs Ready</div>
              </div>
              <div className="glass-surface rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#FFD700] mb-1">432Hz</div>
                <div className="text-sm text-white/60">Frequency</div>
              </div>
            </div>

            {/* Progress Items */}
            <div className="space-y-3">
              {progressItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="glass-surface rounded-lg p-4 flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-white/10 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{item.text}</p>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white/80">
                      {item.status}
                    </Badge>
                  </div>
                )
              })}
            </div>

            {/* Overall Status */}
            <div className="glass-surface rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-400/20">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">System Ready</p>
                  <p className="text-sm text-white/60">All components synchronized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
