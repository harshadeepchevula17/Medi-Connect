import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const globeRef = useRef(null)
  const pointsRef = useRef(null)

  const points = useMemo(() => {
    const count = 260
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.28 + Math.random() * 0.1
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return positions
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.18
      globeRef.current.rotation.x = Math.sin(t * 0.12) * 0.05
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.12
    }
  })

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.18} metalness={0.55} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.18, 48, 48]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.06} wireframe />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#2563eb" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.012, 16, 120]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[1.38, 0.009, 16, 120]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function GlobeLights() {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-3, -2, 4]} intensity={0.7} color="#dbeafe" />
      <pointLight position={[0, 0, 3]} intensity={1.4} color="#2563eb" />
    </>
  )
}

export default function HealthcareGlobe({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.4], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
        <GlobeLights />
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.45}>
          <Globe />
        </Float>
      </Canvas>
    </div>
  )
}
