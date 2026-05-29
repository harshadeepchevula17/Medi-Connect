import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function EnergyOrb() {
  const meshRef = useRef()
  const glowRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15
      meshRef.current.rotation.y = t * 0.15
      meshRef.current.position.y = Math.sin(t * 0.3) * 0.06
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06)
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 0.7) * 0.08
    }
    if (innerRef.current) {
      innerRef.current.scale.setScalar(1 + Math.sin(t * 0.9) * 0.04)
      innerRef.current.rotation.x = Math.sin(t * 0.5) * 0.1
      innerRef.current.rotation.z = Math.cos(t * 0.4) * 0.1
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.sin(t * 0.35) * 0.4
      ring1Ref.current.rotation.y = t * 0.3
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.cos(t * 0.25) * 0.5
      ring2Ref.current.rotation.z = t * 0.2
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = Math.sin(t * 0.3) * 0.3
      ring3Ref.current.rotation.z = t * 0.15
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.6}>
      <group>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.8, 3]} />
          <MeshDistortMaterial
            color="#0ea5e9"
            emissive="#14b8a6"
            emissiveIntensity={1.2}
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.92}
            distort={0.35}
            speed={4}
          />
        </mesh>
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[0.5, 1]} />
          <MeshDistortMaterial
            color="#14b8a6"
            emissive="#0ea5e9"
            emissiveIntensity={2}
            roughness={0}
            metalness={0.3}
            transparent
            opacity={0.4}
            distort={0.5}
            speed={6}
          />
        </mesh>
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.2, 0.015, 24, 96]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.4, 0.01, 24, 96]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={ring3Ref} rotation={[Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[1.1, 0.008, 24, 96]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </Float>
  )
}

function OrbParticles() {
  const count = 500
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.5 + Math.random() * 1.5
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = r * Math.cos(phi)
    }
    return p
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.12
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.06
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#0ea5e9" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function OrbLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} color="#0ea5e9" />
      <directionalLight position={[-2, -3, -4]} intensity={0.4} color="#14b8a6" />
      <pointLight position={[0, 0, 2]} intensity={0.6} color="#6366f1" distance={5} />
      <pointLight position={[0.5, -0.5, 1.5]} intensity={0.3} color="#0ea5e9" distance={4} />
    </>
  )
}

export default function AiEnergyOrb({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 3.8], fov: 35 }} dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}>
        <OrbLights />
        <EnergyOrb />
        <OrbParticles />
      </Canvas>
    </div>
  )
}
