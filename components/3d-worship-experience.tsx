"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Loader } from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { audioEngine, handpanFrequencies } from "@/lib/audio-engine"
import { WorshipEnvironment } from "./3d-worship-environment"
import { CymaticParticles, SacredGeometry } from "./cymatic-particles"
import * as THREE from "three"
import { Button } from "./ui/button"
import { Volume2, VolumeX, Settings2 } from "./icons"
import { Slider } from "./ui/slider"

gsap.registerPlugin(useGSAP)

type EnvironmentTheme = "cosmic" | "temple" | "nature" | "covenant" | "cross" | "resurrection"
type QualityLevel = "low" | "medium" | "high" | "ultra"

interface NoteData {
  note: string
  frequency: number
  position: THREE.Vector3
}

function Handpan3DModel({ onNoteClick, activeNote }: { onNoteClick: (note: string, frequency: number) => void; activeNote: string | null }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredNote, setHoveredNote] = useState<string | null>(null)

  const centerNote: NoteData = {
    note: handpanFrequencies.center.note,
    frequency: handpanFrequencies.center.frequency,
    position: new THREE.Vector3(0, 0.1, 0),
  }

  const outerNotes: NoteData[] = handpanFrequencies.outerRing.map((noteData) => {
    const angle = (noteData.angle - 90) * (Math.PI / 180)
    const radius = 1.8
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    return {
      note: noteData.note,
      frequency: noteData.frequency,
      position: new THREE.Vector3(x, 0.05, z),
    }
  })

  useGSAP(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: "+=0.1",
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    }
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3, 3.2, 0.4, 64]} />
        <meshStandardMaterial
          color="#d4a574"
          metalness={0.8}
          roughness={0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      <mesh
        position={centerNote.position}
        onClick={() => onNoteClick(centerNote.note, centerNote.frequency)}
        onPointerOver={() => setHoveredNote(centerNote.note)}
        onPointerOut={() => setHoveredNote(null)}
        castShadow
      >
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial
          color={activeNote === centerNote.note ? "#fbbf24" : hoveredNote === centerNote.note ? "#e8c9a0" : "#c9a87c"}
          metalness={0.7}
          roughness={0.4}
          emissive={activeNote === centerNote.note ? "#fbbf24" : "#000000"}
          emissiveIntensity={activeNote === centerNote.note ? 0.5 : 0}
        />
      </mesh>

      {outerNotes.map((noteData) => (
        <mesh
          key={noteData.note}
          position={noteData.position}
          onClick={() => onNoteClick(noteData.note, noteData.frequency)}
          onPointerOver={() => setHoveredNote(noteData.note)}
          onPointerOut={() => setHoveredNote(null)}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
          <meshStandardMaterial
            color={activeNote === noteData.note ? "#fbbf24" : hoveredNote === noteData.note ? "#e8c9a0" : "#d4a574"}
            metalness={0.7}
            roughness={0.4}
            emissive={activeNote === noteData.note ? "#fbbf24" : "#000000"}
            emissiveIntensity={activeNote === noteData.note ? 0.5 : 0}
          />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ activeNote, activeFrequency, environment, quality }: {
  activeNote: string | null
  activeFrequency: number
  environment: EnvironmentTheme
  quality: QualityLevel
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={50} />
      
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow={quality !== "low"}
        shadow-mapSize-width={quality === "ultra" ? 2048 : 1024}
        shadow-mapSize-height={quality === "ultra" ? 2048 : 1024}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#93c5fd" />
      <pointLight position={[10, 5, 10]} intensity={0.3} color="#c4b5fd" />
      
      <WorshipEnvironment theme={environment} intensity={1} />
      
      <Suspense fallback={null}>
        <Handpan3DModel onNoteClick={() => {}} activeNote={activeNote} />
      </Suspense>
      
      {quality !== "low" && (
        <>
          <CymaticParticles frequency={activeFrequency} isActive={activeNote !== null} color="#fbbf24" />
          <SacredGeometry frequency={activeFrequency} isActive={activeNote !== null} color="#93c5fd" />
        </>
      )}
      
      <ContactShadows
        position={[0, -0.2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
      
      <Environment preset="sunset" />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

function detectQuality(): QualityLevel {
  if (typeof window === "undefined") return "medium"
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const memory = (navigator as any).deviceMemory || 4
  
  if (isMobile) {
    return memory > 4 ? "medium" : "low"
  }
  
  if (memory > 8) return "ultra"
  if (memory > 4) return "high"
  return "medium"
}

export function WorshipExperience3D() {
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [activeFrequency, setActiveFrequency] = useState(432)
  const [isInitialized, setIsInitialized] = useState(false)
  const [environment, setEnvironment] = useState<EnvironmentTheme>("cosmic")
  const [quality, setQuality] = useState<QualityLevel>("medium")
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setQuality(detectQuality())
  }, [])

  const handleNoteClick = async (note: string, frequency: number) => {
    if (!isInitialized) {
      await audioEngine.initialize()
      setIsInitialized(true)
    }
    
    if (!isMuted) {
      audioEngine.playNote(frequency)
    }
    
    setActiveNote(note)
    setActiveFrequency(frequency)
    setTimeout(() => {
      setActiveNote(null)
      setActiveFrequency(432)
    }, 800)
  }

  useEffect(() => {
    if (isInitialized) {
      audioEngine.setVolume((volume - 100) / 5)
    }
  }, [volume, isInitialized])

  return (
    <div className="relative w-full h-[700px] rounded-xl overflow-hidden glass-card">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="glass-button bg-white/90 hover:bg-white backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="glass-button bg-white/90 hover:bg-white backdrop-blur-sm"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>

      {showSettings && (
        <div className="absolute top-16 left-4 z-10 glass-card p-4 space-y-4 w-72 backdrop-blur-lg">
          <div>
            <label className="text-sm font-medium mb-2 block">Environment</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as EnvironmentTheme)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm backdrop-blur-sm"
            >
              <option value="cosmic">Cosmic Space</option>
              <option value="temple">Sacred Temple</option>
              <option value="nature">Nature Sanctuary</option>
              <option value="covenant">Blood Covenant</option>
              <option value="cross">Cross Victory</option>
              <option value="resurrection">Resurrection Light</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Quality: {quality}</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as QualityLevel)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm backdrop-blur-sm"
            >
              <option value="low">Low (Mobile)</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Volume: {volume}%</label>
            <Slider
              value={[volume]}
              onValueChange={(v) => setVolume(v[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      )}

      <Canvas shadows={quality !== "low"}>
        <Scene activeNote={activeNote} activeFrequency={activeFrequency} environment={environment} quality={quality} />
        
        {quality === "ultra" && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} intensity={0.5} />
            <ChromaticAberration offset={[0.001, 0.001]} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Canvas>
      
      <Loader />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-white text-sm glass-card px-4 py-2 backdrop-blur-lg">
          Click the handpan to play • 432Hz Sacred Tuning • {environment.charAt(0).toUpperCase() + environment.slice(1)} Environment
        </p>
      </div>
    </div>
  )
}
