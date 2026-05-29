import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Sphere() {
  const meshRef = useRef()
  const glowRef = useRef()
  const ringRef = useRef()

  const particles = useMemo(() => {
    const count = 500
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.2 + Math.random() * 0.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
      meshRef.current.rotation.y = t * 0.2
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 0.5) * 0.08
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3
      ringRef.current.rotation.z = t * 0.3
    }
  })

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.12} wireframe />
      </mesh>

      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhongMaterial
          color="#f0f7ff"
          emissive="#0ea5e9"
          emissiveIntensity={0.1}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#14b8a6"
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} />
      </mesh>

      <mesh>
        <torusGeometry args={[1.2, 0.005, 16, 100]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 3, 4]} intensity={0.4} color="#0ea5e9" />
      <directionalLight position={[-2, -3, -4]} intensity={0.3} color="#14b8a6" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#0ea5e9" />
    </>
  )
}

export default function AiSphere() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <Lights />
      <Sphere />
    </Canvas>
  )
}
