import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'

function PanelFrame({ position = [0, 0, 0], rotation = [0, 0, 0], width = 2, height = 1.2, color = '#00f0ff' }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5 + position[1]) * 0.05
    }
  })

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const w = width / 2
    const h = height / 2
    const r = 0.05
    s.moveTo(-w + r, -h)
    s.lineTo(w - r, -h)
    s.quadraticCurveTo(w, -h, w, -h + r)
    s.lineTo(w, h - r)
    s.quadraticCurveTo(w, h, w - r, h)
    s.lineTo(-w + r, h)
    s.quadraticCurveTo(-w, h, -w, h - r)
    s.lineTo(-w, -h + r)
    s.quadraticCurveTo(-w, -h, -w + r, -h)
    return s
  }, [width, height])

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ref}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
          wireframe
        />
      </mesh>
    </group>
  )
}

function DataLines({ count = 8 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const p = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1.6
      const y1 = (Math.random() - 0.5) * 0.8
      const y2 = y1 + (Math.random() - 0.5) * 0.3
      p[i * 6] = x
      p[i * 6 + 1] = y1
      p[i * 6 + 2] = 0.02
      p[i * 6 + 3] = x
      p[i * 6 + 4] = y2
      p[i * 6 + 5] = 0.02
    }
    return p
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      const p = ref.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const idx = i * 6 + 4
        p[idx] = -0.4 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.4
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count * 2} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#00f0ff" transparent opacity={0.2} />
    </lineSegments>
  )
}

function PanelLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[1, 1, 2]} intensity={0.3} color="#00f0ff" />
    </>
  )
}

export default function HolographicPanel({ className = '', panels = 1 }) {
  const panelConfigs = useMemo(() => {
    const configs = []
    for (let i = 0; i < panels; i++) {
      const angle = (i / panels) * Math.PI * 2
      const radius = 1.8
      configs.push({
        position: [Math.cos(angle) * radius, Math.sin(angle * 0.5) * 0.5, Math.sin(angle) * radius * 0.3],
        rotation: [0, -angle, Math.sin(angle) * 0.1],
        color: i % 2 === 0 ? '#00f0ff' : '#7c3aed',
      })
    }
    return configs
  }, [panels])

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]}>
        <PanelLights />
        {panelConfigs.map((cfg, i) => (
          <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.05} floatIntensity={0.3}>
            <PanelFrame position={cfg.position} rotation={cfg.rotation} color={cfg.color} />
            <DataLines count={6} />
          </Float>
        ))}
      </Canvas>
    </div>
  )
}
