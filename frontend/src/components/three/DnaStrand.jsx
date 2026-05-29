import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Dna({ count = 20, radius = 1.5, height = 4 }) {
  const groupRef = useRef()

  const nodes = useMemo(() => {
    const n = []
    for (let i = 0; i < count; i++) {
      const t = i / count
      const angle = t * Math.PI * 6
      const y = (t - 0.5) * height
      const r1 = radius
      const r2 = radius
      n.push({
        pos1: [Math.cos(angle) * r1, y, Math.sin(angle) * r1],
        pos2: [Math.cos(angle + Math.PI) * r2, y, Math.sin(angle + Math.PI) * r2],
        color: i % 2 === 0 ? '#00f0ff' : '#7c3aed',
      })
    }
    return n
  }, [count, radius, height])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  const lines = useMemo(() => {
    const pts1 = []
    const pts2 = []
    for (let i = 0; i < count; i++) {
      const t = i / count
      const angle = t * Math.PI * 6
      const y = (t - 0.5) * height
      pts1.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius))
      pts2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius))
    }
    return [pts1, pts2]
  }, [count, radius, height])

  return (
    <group ref={groupRef}>
      {lines.map((pts, i) => (
        <line key={`backbone-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={pts.length}
              array={new Float32Array(pts.flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={i === 0 ? '#00f0ff' : '#7c3aed'} transparent opacity={0.4} />
        </line>
      ))}

      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.pos1}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={node.pos2}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.5} />
          </mesh>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...node.pos1, ...node.pos2])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#6366f1" transparent opacity={0.2} />
          </line>
        </group>
      ))}
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 5, 5]} intensity={0.5} color="#00f0ff" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#7c3aed" />
    </>
  )
}

export default function DnaStrand() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Lights />
        <Dna />
      </Canvas>
    </div>
  )
}
