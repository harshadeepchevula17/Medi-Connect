import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function StarField() {
  const ref = useRef()
  const count = 1200
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.01
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#6ef7ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function NeuralLinks() {
  const ref = useRef()
  const count = 160
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.05
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#6f86ff" transparent opacity={0.13} />
    </lineSegments>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 2, 4]} intensity={0.45} color="#62e8ff" distance={14} />
      <pointLight position={[-3, -2, 3]} intensity={0.35} color="#6f86ff" distance={12} />
    </>
  )
}

export default function AnimatedBackground({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 52 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Lights />
        <StarField />
        <NeuralLinks />
      </Canvas>
    </div>
  )
}
