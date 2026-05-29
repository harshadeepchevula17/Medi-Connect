import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function HelixStrand() {
  const groupRef = useRef()
  const count = 32
  const radius = 0.8
  const height = 3
  const turns = 3

  const { nodes, connections } = useMemo(() => {
    const n = []
    const c = []
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * Math.PI * 2 * turns
      const y = (i / count - 0.5) * height
      const angle = t
      n.push({
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        pos2: [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius],
        color1: i % 2 === 0 ? '#00f0ff' : '#7c3aed',
        color2: i % 2 === 0 ? '#7c3aed' : '#00f0ff',
      })
      if (i < count) {
        c.push([i, i + 1])
      }
    }
    return { nodes: n, connections: c }
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.pos}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshPhysicalMaterial
              color={node.color1}
              emissive={node.color1}
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={node.pos2}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshPhysicalMaterial
              color={node.color2}
              emissive={node.color2}
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.008, 0.008, 0.8, 4]} />
            <meshPhysicalMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
            <primitive object={new THREE.Object3D()} />
          </mesh>
        </group>
      ))}
      {connections.map(([a, b], i) => {
        if (a >= nodes.length || b >= nodes.length) return null
        const p1 = new THREE.Vector3(...nodes[a].pos)
        const p2 = new THREE.Vector3(...nodes[b].pos)
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
        const dir = new THREE.Vector3().subVectors(p2, p1)
        const len = dir.length()
        if (len === 0) return null
        return (
          <mesh key={`c1-${i}`} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())}>
            <cylinderGeometry args={[0.006, 0.006, len, 4]} />
            <meshPhysicalMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} transparent opacity={0.3} />
          </mesh>
        )
      })}
      {connections.map(([a, b], i) => {
        if (a >= nodes.length || b >= nodes.length) return null
        const p1 = new THREE.Vector3(...nodes[a].pos2)
        const p2 = new THREE.Vector3(...nodes[b].pos2)
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
        const dir = new THREE.Vector3().subVectors(p2, p1)
        const len = dir.length()
        if (len === 0) return null
        return (
          <mesh key={`c2-${i}`} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())}>
            <cylinderGeometry args={[0.006, 0.006, len, 4]} />
            <meshPhysicalMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.2} transparent opacity={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

function HelixLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 3, 4]} intensity={0.5} color="#00f0ff" />
      <directionalLight position={[-2, -3, -4]} intensity={0.3} color="#7c3aed" />
      <pointLight position={[0, 1, 0]} intensity={0.4} color="#6366f1" />
    </>
  )
}

export default function DnaHelix({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} dpr={[1, 1.5]}>
        <HelixLights />
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
          <HelixStrand />
        </Float>
      </Canvas>
    </div>
  )
}
