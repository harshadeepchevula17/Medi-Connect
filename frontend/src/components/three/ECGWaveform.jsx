import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WaveformLine() {
  const pointsRef = useRef()
  const count = 180
  const width = 5
  const height = 1.5

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * width - width / 2
      pos[i * 3] = t
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
      const c = new THREE.Color().setHSL(0.52 + (i / count) * 0.2, 0.9, 0.6)
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * width - width / 2
      const phase = x * 3.5 + t * 2.5
      let y = 0
      const beat = Math.sin(t * 1.2) * 0.5 + 0.5
      if (x > -0.4 && x < 0.4) {
        y = Math.sin(phase) * height * 0.35
        y += Math.exp(-Math.pow(x * 10, 2)) * height * beat * 0.9
      } else {
        y = Math.sin(phase) * height * 0.18
      }
      y += Math.sin(x * 2.5 + t * 3.5) * height * 0.06
      y += Math.sin(x * 5 + t * 1.5) * height * 0.03
      pos[i * 3 + 1] = y
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <line ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.9} linewidth={2} />
    </line>
  )
}

function WaveformGlow() {
  const glowRef = useRef()
  const count = 180
  const width = 5

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (i / (count - 1)) * width - width / 2
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!glowRef.current) return
    const pos = glowRef.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * width - width / 2
      const phase = x * 3.5 + t * 2.5
      let y = 0
      const beat = Math.sin(t * 1.2) * 0.5 + 0.5
      if (x > -0.4 && x < 0.4) {
        y = Math.sin(phase) * height * 0.35
        y += Math.exp(-Math.pow(x * 10, 2)) * height * beat * 0.9
      } else {
        y = Math.sin(phase) * height * 0.18
      }
      y += Math.sin(x * 2.5 + t * 3.5) * height * 0.06
      pos[i * 3 + 1] = y
    }
    glowRef.current.geometry.attributes.position.needsUpdate = true
  })

  const height = 1.5

  return (
    <line ref={glowRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#00f0ff" transparent opacity={0.12} />
    </line>
  )
}

function ECGPoints() {
  const ref = useRef()
  const count = 150
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 6
      p[i * 3 + 1] = (Math.random() - 0.5) * 3
      p[i * 3 + 2] = (Math.random() - 0.5) * 1
    }
    return p
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#00f0ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function ECGLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#00f0ff" />
    </>
  )
}

export default function ECGWaveform({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 3], fov: 35 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ECGLights />
        <WaveformGlow />
        <WaveformLine />
        <ECGPoints />
      </Canvas>
    </div>
  )
}
