import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function NeuralNodes() {
  const groupRef = useRef()
  const count = 80
  const spread = 5

  const { positions, colors, connections } = useMemo(() => {
    const pos = []
    const col = []
    const conn = []
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
      ])
      const c = new THREE.Color().setHSL(0.52 + Math.random() * 0.25, 0.9, 0.5 + Math.random() * 0.4)
      col.push([c.r, c.g, c.b])
    }
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i][0] - pos[j][0]
        const dy = pos[i][1] - pos[j][1]
        const dz = pos[i][2] - pos[j][2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 2 && Math.random() > 0.8) {
          conn.push([i, j, dist])
        }
      }
    }
    return { positions: pos, colors: col, connections: conn }
  }, [])

  const nodesRef = useRef()
  const linesRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04
      groupRef.current.rotation.x = Math.sin(t * 0.015) * 0.08
    }
    if (nodesRef.current) {
      const s = 0.8 + Math.sin(t * 0.8) * 0.3
      nodesRef.current.scale.setScalar(s)
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.02
      glowRef.current.rotation.x = Math.sin(t * 0.01) * 0.03
    }
  })

  const lineVertices = useMemo(() => {
    const verts = []
    connections.forEach(([i, j]) => {
      verts.push(...positions[i])
      verts.push(...positions[j])
    })
    return new Float32Array(verts)
  }, [connections, positions])

  const lineColors = useMemo(() => {
    const cols = []
    connections.forEach(([i, j]) => {
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 0.8, 0.4)
      cols.push(c.r, c.g, c.b)
      cols.push(c.r, c.g, c.b)
    })
    return new Float32Array(cols)
  }, [connections])

  return (
    <group ref={groupRef}>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length} array={new Float32Array(positions.flat())} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length} array={new Float32Array(colors.flat())} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lineVertices.length / 3} array={lineVertices} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={lineColors.length / 3} array={lineColors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.15} />
      </lineSegments>
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length} array={new Float32Array(positions.flat())} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.2} color="#00f0ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  )
}

function NeuralParticles() {
  const count = 600
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10
      p[i * 3 + 1] = (Math.random() - 0.5) * 10
      p[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return p
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.006} color="#6366f1" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function NeuralLights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} color="#00f0ff" />
      <directionalLight position={[-2, -3, -4]} intensity={0.3} color="#7c3aed" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#6366f1" />
    </>
  )
}

export default function NeuralNetwork({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}>
        <NeuralLights />
        <NeuralNodes />
        <NeuralParticles />
      </Canvas>
    </div>
  )
}
