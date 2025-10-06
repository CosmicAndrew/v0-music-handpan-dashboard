"use client"

import { useState } from "react"

interface SettingsProps {
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
}

export function Settings({ theme, setTheme }: SettingsProps) {
  const [audioQuality, setAudioQuality] = useState("high")
  const [volume, setVolume] = useState(70)
  const [tuningStandard, setTuningStandard] = useState("432hz")
  const [autoSave, setAutoSave] = useState(true)

  return (
    <div className="relative min-h-screen p-6">
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
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="glass-elevated p-8 rounded-2xl">
          <h1
            className="text-4xl font-bold text-white mb-2"
            style={{
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
            }}
          >
            System Settings
          </h1>
          <p
            className="text-white/95"
            style={{
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            Configure your worship experience and view practice history
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Appearance */}
          <div className="glass-surface p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl backdrop-blur-sm border-2 border-white/40">
                🌙
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  Appearance
                </h2>
                <p
                  className="text-sm text-white/95"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Theme and visual preferences
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label
                className="block text-sm font-bold text-white mb-2"
                style={{
                  textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                }}
              >
                Theme Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    theme === "light"
                      ? "bg-white/40 border-white/60 shadow-lg"
                      : "bg-white/20 border-white/30 hover:bg-white/25"
                  }`}
                >
                  <div className="text-2xl mb-1">☀️</div>
                  <div
                    className="text-xs font-bold text-white"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Light
                  </div>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    theme === "dark"
                      ? "bg-white/40 border-white/60 shadow-lg"
                      : "bg-white/20 border-white/30 hover:bg-white/25"
                  }`}
                >
                  <div className="text-2xl mb-1">🌙</div>
                  <div
                    className="text-xs font-bold text-white"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Dark
                  </div>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    theme === "system"
                      ? "bg-white/40 border-white/60 shadow-lg"
                      : "bg-white/20 border-white/30 hover:bg-white/25"
                  }`}
                >
                  <div className="text-2xl mb-1">💻</div>
                  <div
                    className="text-xs font-bold text-white"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    System
                  </div>
                </button>
              </div>
              <p
                className="text-xs text-white/90 mt-2 bg-black/20 px-3 py-2 rounded-lg backdrop-blur-sm"
                style={{
                  textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                }}
              >
                {theme === "system"
                  ? "Automatically matches your device settings"
                  : `Using ${theme} mode across the app`}
              </p>
            </div>
          </div>

          {/* Audio Preferences */}
          <div className="glass-surface p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl backdrop-blur-sm border-2 border-white/40">
                🎵
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  Audio Preferences
                </h2>
                <p
                  className="text-sm text-white/95"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Sound quality and playback
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-bold text-white mb-2"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Audio Quality
                </label>
                <select
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(e.target.value)}
                  className="settings-select"
                >
                  <option value="high">High (Recommended)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-bold text-white mb-2"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Volume Level
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="settings-slider"
                  />
                  <div className="flex justify-between text-xs">
                    <span
                      className="text-white/90 font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      0%
                    </span>
                    <span
                      className="text-white font-bold bg-black/30 px-3 py-1 rounded backdrop-blur-sm"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {volume}%
                    </span>
                    <span
                      className="text-white/90 font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      100%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg backdrop-blur-sm border-2 border-white/30">
                <span
                  className="text-sm font-bold text-white"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Auto-save recordings
                </span>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-14 h-7 rounded-full transition-all border-2 ${
                    autoSave ? "bg-green-500 border-green-400" : "bg-white/30 border-white/40"
                  }`}
                  style={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-lg ${
                      autoSave ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Tuning Configuration */}
          <div className="glass-surface p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl backdrop-blur-sm border-2 border-white/40">
                🎚️
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  Tuning Configuration
                </h2>
                <p
                  className="text-sm text-white/95"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Frequency and scale settings
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-bold text-white mb-2"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Tuning Standard
                </label>
                <select
                  value={tuningStandard}
                  onChange={(e) => setTuningStandard(e.target.value)}
                  className="settings-select"
                >
                  <option value="432hz">432 Hz (Sacred)</option>
                  <option value="440hz">440 Hz (Standard)</option>
                </select>
              </div>

              <div className="p-4 rounded-lg bg-white/20 border-2 border-white/40 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✨</span>
                  <span
                    className="text-sm font-bold text-white"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Sacred Frequency Active
                  </span>
                </div>
                <p
                  className="text-xs text-white/95 leading-relaxed"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  432 Hz resonates with the natural harmonic series and promotes spiritual alignment
                </p>
              </div>
            </div>
          </div>

          {/* Practice History */}
          <div className="glass-surface p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl backdrop-blur-sm border-2 border-white/40">
                📊
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  Practice History
                </h2>
                <p
                  className="text-sm text-white/95"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Your recent sessions
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { date: "Today", duration: "45 min", songs: 8 },
                { date: "Yesterday", duration: "32 min", songs: 5 },
                { date: "2 days ago", duration: "28 min", songs: 6 },
              ].map((session, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/20 border-2 border-white/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-sm font-bold text-white"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {session.date}
                    </span>
                    <span
                      className="text-xs text-white/95 bg-black/20 px-2 py-1 rounded font-semibold"
                      style={{
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {session.duration}
                    </span>
                  </div>
                  <p
                    className="text-xs text-white/90"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {session.songs} songs practiced
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Worship Sessions */}
          <div className="glass-surface p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl backdrop-blur-sm border-2 border-white/40">
                ✞
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  Worship Sessions
                </h2>
                <p
                  className="text-sm text-white/95"
                  style={{
                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Devotional engagement
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/20 border-2 border-white/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-sm font-bold text-white"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Total Sessions
                  </span>
                  <span
                    className="text-2xl font-bold text-white"
                    style={{
                      textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    24
                  </span>
                </div>
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden border border-white/20">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: "75%", boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/20 border-2 border-white/30 text-center backdrop-blur-sm">
                  <div
                    className="text-2xl font-bold text-white mb-1"
                    style={{
                      textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    12
                  </div>
                  <div
                    className="text-xs text-white/95 font-semibold"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Devotions Read
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/20 border-2 border-white/30 text-center backdrop-blur-sm">
                  <div
                    className="text-2xl font-bold text-white mb-1"
                    style={{
                      textShadow: "0 2px 8px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    8h
                  </div>
                  <div
                    className="text-xs text-white/95 font-semibold"
                    style={{
                      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Total Time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
