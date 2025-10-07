"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface CymaticParticlesProps {
  frequency: number
  isActive: boolean
  color?: string
}

export function CymaticParticles({ frequency, isActive, color = "#fbbf24" }: CymaticParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)

  const particleCount = 2000
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
    }
    return pos
  }, [])

  const scales = useMemo(() => {
    const s = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      s[i] = Math.random() * 0.5 + 0.5
    }
    return s
  }, [])

  useFrame((state, delta) => {
    if (!particlesRef.current) return

    timeRef.current += delta

    if (isActive) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      const normalizedFreq = frequency / 432.0
      const patternSpeed = normalizedFreq * 2
      const radius = 3

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const angle = (i / particleCount) * Math.PI * 2 * 9
        const spiralRadius = (i / particleCount) * radius

        const theta = angle + timeRef.current * patternSpeed
        const phi = Math.sin(timeRef.current * normalizedFreq + i * 0.1) * Math.PI

        const x = spiralRadius * Math.cos(theta) * Math.sin(phi)
        const y = (i / particleCount) * 2 + Math.sin(timeRef.current * 3 + i * 0.05) * 0.5
        const z = spiralRadius * Math.sin(theta) * Math.sin(phi)

        positions[i3] = x
        positions[i3 + 1] = y
        positions[i3 + 2] = z
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    } else {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3] *= 0.95
        positions[i3 + 1] *= 0.95
        positions[i3 + 2] *= 0.95
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={particleCount}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

interface SacredGeometryProps {
  frequency: number
  isActive: boolean
  color?: string
}

export function SacredGeometry({ frequency, isActive, color = "#93c5fd" }: SacredGeometryProps) {
  const geometryRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (!geometryRef.current) return
    timeRef.current += delta

    if (isActive) {
      const normalizedFreq = frequency / 432.0
      geometryRef.current.rotation.y = timeRef.current * normalizedFreq * 0.5
      geometryRef.current.rotation.z = Math.sin(timeRef.current * normalizedFreq) * 0.2
      
      const scale = 1 + Math.sin(timeRef.current * 3) * 0.1
      geometryRef.current.scale.set(scale, scale, scale)
    } else {
      geometryRef.current.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.1)
    }
  })

  const goldenRatio = 1.618
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const count = 12
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 * goldenRatio
      const radius = 2 + Math.sin(angle * 3) * 0.5
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * radius
      ))
    }
    pts.push(pts[0])
    return pts
  }, [])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])

  return (
    <group ref={geometryRef} position={[0, 2, 0]}>
      <mesh>
        <tubeGeometry args={[curve, 100, 0.02, 8, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}
