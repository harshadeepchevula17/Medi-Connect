import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GridSystem() {
  const gridRef = useRef()

  const gridPoints = useMemo(() => {
    const size = 8
    const divisions = 24
    const points = []
    const step = size / divisions
    const half = size / 2
    for (let i = 0; i <= divisions; i++) {
      const x = -half + i * step
      points.push([x, -half, 0], [x, half, 0])
    }
    for (let i = 0; i <= divisions; i++) {
      const y = -half + i * step
      points.push([-half, y, 0], [half, y, 0])
    }
    return new Float32Array(points.flat())
  }, [])

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.12) % 0.5
    }
  })

  return (
    <lineSegments ref={gridRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={gridPoints.length / 3} array={gridPoints} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#00f0ff" transparent opacity={0.06} />
    </lineSegments>
  )
}

function VerticalGrid() {
  const gridRef = useRef()

  const gridPoints = useMemo(() => {
    const size = 8
    const divisions = 18
    const points = []
    const step = size / divisions
    const half = size / 2
    for (let i = 0; i <= divisions; i++) {
      const x = -half + i * step
      points.push([x, -half, -half], [x, half, -half])
    }
    for (let i = 0; i <= divisions; i++) {
      const y = -half + i * step
      points.push([-half, y, -half], [half, y, -half])
    }
    return new Float32Array(points.flat())
  }, [])

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = ((state.clock.elapsedTime * 0.08) % 0.3)
    }
  })

  return (
    <lineSegments ref={gridRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={gridPoints.length / 3} array={gridPoints} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.04} />
    </lineSegments>
  )
}

function GridNodes() {
  const count = 60
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 8
      p[i * 3 + 1] = (Math.random() - 0.5) * 8
      p[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
    return p
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const s = 0.8 + Math.sin(state.clock.elapsedTime * 0.4) * 0.2
      ref.current.material.size = 0.05 * s
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00f0ff" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}

export default function MedicalGrid({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.2} />
        <GridSystem />
        <VerticalGrid />
        <GridNodes />
      </Canvas>
    </div>
  )
}
