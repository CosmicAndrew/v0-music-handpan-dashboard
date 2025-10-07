"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Stars, Cloud } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

type EnvironmentTheme = "cosmic" | "temple" | "nature" | "covenant" | "cross" | "resurrection"

interface WorshipEnvironmentProps {
  theme: EnvironmentTheme
  intensity?: number
}

export function WorshipEnvironment({ theme, intensity = 1 }: WorshipEnvironmentProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, camera } = useThree()
  const previousThemeRef = useRef<EnvironmentTheme | null>(null)

  useEffect(() => {
    if (previousThemeRef.current !== theme && groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 2,
        ease: "power2.inOut",
      })

      gsap.fromTo(
        groupRef.current.scale,
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.7)" }
      )

      if (camera) {
        gsap.to(camera.position, {
          y: getThemeCameraY(theme),
          duration: 2,
          ease: "power2.inOut",
        })
      }

      previousThemeRef.current = theme
    }
  }, [theme, camera])

  function getThemeCameraY(theme: EnvironmentTheme): number {
    switch (theme) {
      case "cosmic": return 10
      case "temple": return 8
      case "nature": return 9
      case "covenant": return 7
      case "cross": return 12
      case "resurrection": return 15
      default: return 8
    }
  }

  function getEnvironmentColor(theme: EnvironmentTheme): string {
    switch (theme) {
      case "cosmic": return "#1e1b4b"
      case "temple": return "#7c3aed"
      case "nature": return "#065f46"
      case "covenant": return "#991b1b"
      case "cross": return "#78350f"
      case "resurrection": return "#fef3c7"
      default: return "#1e1b4b"
    }
  }

  useEffect(() => {
    scene.fog = new THREE.FogExp2(getEnvironmentColor(theme), 0.05)
  }, [theme, scene])

  return (
    <group ref={groupRef}>
      {theme === "cosmic" && (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}

      {theme === "temple" && (
        <>
          <ambientLight intensity={0.3 * intensity} color="#c4b5fd" />
          <pointLight position={[0, 10, 0]} intensity={2 * intensity} color="#a78bfa" />
          
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = Math.cos(angle) * 8
            const z = Math.sin(angle) * 8
            return (
              <mesh key={i} position={[x, 0, z]}>
                <cylinderGeometry args={[0.3, 0.3, 12, 16]} />
                <meshStandardMaterial color="#8b5cf6" metalness={0.7} roughness={0.3} />
              </mesh>
            )
          })}
        </>
      )}

      {theme === "nature" && (
        <>
          <Cloud opacity={0.5} speed={0.2} width={10} depth={1.5} segments={20} position={[5, 8, -5]} color="#d1fae5" />
          <Cloud opacity={0.5} speed={0.2} width={10} depth={1.5} segments={20} position={[-5, 9, 5]} color="#a7f3d0" />
          
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#065f46" roughness={0.8} />
          </mesh>
        </>
      )}

      {theme === "covenant" && (
        <>
          <ambientLight intensity={0.2 * intensity} color="#dc2626" />
          <pointLight position={[0, 5, 0]} intensity={3 * intensity} color="#b91c1c" distance={20} decay={2} />
          
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
          
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const radius = 4
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            return (
              <mesh key={i} position={[x, 2, z]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
              </mesh>
            )
          })}
        </>
      )}

      {theme === "cross" && (
        <>
          <ambientLight intensity={0.3 * intensity} color="#fbbf24" />
          <directionalLight position={[0, 10, 5]} intensity={2 * intensity} color="#f59e0b" castShadow />
          
          <mesh position={[0, 3, -8]}>
            <boxGeometry args={[0.5, 8, 0.5]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 5, -8]} rotation={[0, 0, 0]}>
            <boxGeometry args={[4, 0.5, 0.5]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
        </>
      )}

      {theme === "resurrection" && (
        <>
          <ambientLight intensity={0.8 * intensity} color="#fef3c7" />
          <pointLight position={[0, 15, 0]} intensity={5 * intensity} color="#fde68a" />
          
          <mesh position={[0, 10, 0]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color="#fef3c7" transparent opacity={0.8} />
          </mesh>
          
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2
            const radius = 6 + Math.sin(i * 0.5) * 2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = 5 + Math.sin(i * 0.3) * 3
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#fcd34d" transparent opacity={0.7} />
              </mesh>
            )
          })}
        </>
      )}
    </group>
  )
}

export function EnvironmentTransition({ from, to, onComplete }: { from: EnvironmentTheme; to: EnvironmentTheme; onComplete?: () => void }) {
  const transitionRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (transitionRef.current) {
      gsap.timeline()
        .to(transitionRef.current.scale, {
          x: 5,
          y: 5,
          z: 5,
          duration: 1,
          ease: "power2.in",
        })
        .to(transitionRef.current.material, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => onComplete?.(),
        })
    }
  }, [from, to, onComplete])

  return (
    <mesh ref={transitionRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={1} />
    </mesh>
  )
}
