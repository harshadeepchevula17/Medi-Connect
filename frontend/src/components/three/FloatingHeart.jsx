import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function HeartShape() {
  const meshRef = useRef()
  const glowRef = useRef()

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.3)
    s.bezierCurveTo(0, 0.7, -0.6, 1, -0.6, 0.5)
    s.bezierCurveTo(-0.6, 0, 0, -0.1, 0, -0.5)
    s.bezierCurveTo(0, -0.1, 0.6, 0, 0.6, 0.5)
    s.bezierCurveTo(0.6, 1, 0, 0.7, 0, 0.3)
    return s
  }, [])

  const config = useMemo(() => ({
    shape,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.03,
    bevelSegments: 12,
  }), [shape])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.15
      meshRef.current.rotation.y = Math.sin(t * 0.25) * 0.25
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.08
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.08)
      glowRef.current.material.opacity = 0.08 + Math.sin(t * 0.4) * 0.04
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={1.2}>
      <group>
        <mesh ref={meshRef} rotation={[0.2, 0, 0]}>
          <extrudeGeometry args={[config.shape, config]} />
          <MeshDistortMaterial
            color="#f472b6"
            emissive="#ec4899"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.95}
            distort={0.12}
            speed={3}
          />
        </mesh>
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial
            color="#f472b6"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[0.2, 0, 0]} position={[0, 0, 0.15]}>
          <extrudeGeometry args={[config.shape, config]} />
          <meshBasicMaterial
            color="#f472b6"
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  )
}

function HeartParticles() {
  const count = 400
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1 + Math.random() * 1.5
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = r * Math.cos(phi)
    }
    return p
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#f472b6"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function HeartLight() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#f472b6" />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#ec4899" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#f472b6" distance={5} />
      <pointLight position={[1, -1, 2]} intensity={0.4} color="#ff6b9d" distance={4} />
    </>
  )
}

export default function FloatingHeart({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
        <HeartLight />
        <HeartShape />
        <HeartParticles />
      </Canvas>
    </div>
  )
}
