"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { audioEngine, handpanFrequencies } from "@/lib/audio-engine"

interface NoteData {
  note: string
  frequency: number
  position: THREE.Vector3
  angle: number
}

function HandpanModel({ onNoteClick, activeNote }: { onNoteClick: (note: string, frequency: number) => void; activeNote: string | null }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredNote, setHoveredNote] = useState<string | null>(null)

  const centerNote: NoteData = {
    note: handpanFrequencies.center.note,
    frequency: handpanFrequencies.center.frequency,
    position: new THREE.Vector3(0, 0.1, 0),
    angle: 0,
  }

  const outerNotes: NoteData[] = handpanFrequencies.outerRing.map((noteData, index) => {
    const angle = (noteData.angle - 90) * (Math.PI / 180)
    const radius = 1.8
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    return {
      note: noteData.note,
      frequency: noteData.frequency,
      position: new THREE.Vector3(x, 0.05, z),
      angle: noteData.angle,
    }
  })

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.2, 0.4, 64]} />
        <meshStandardMaterial
          color="#d4a574"
          metalness={0.8}
          roughness={0.3}
          envMapIntensity={1.2}
        />
      </mesh>

      <mesh position={centerNote.position} onClick={() => onNoteClick(centerNote.note, centerNote.frequency)} onPointerOver={() => setHoveredNote(centerNote.note)} onPointerOut={() => setHoveredNote(null)}>
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

function CameraController() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, 8, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

export function Handpan3D() {
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const handleNoteClick = async (note: string, frequency: number) => {
    if (!isInitialized) {
      await audioEngine.initialize()
      setIsInitialized(true)
    }
    
    audioEngine.playNote(frequency)
    setActiveNote(note)
    setTimeout(() => setActiveNote(null), 800)
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden glass-card">
      <Canvas shadows>
        <CameraController />
        
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#93c5fd" />
        <pointLight position={[10, 5, 10]} intensity={0.3} color="#c4b5fd" />
        
        <HandpanModel onNoteClick={handleNoteClick} activeNote={activeNote} />
        
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
      </Canvas>
    </div>
  )
}
