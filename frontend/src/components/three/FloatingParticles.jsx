import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 400, color = '#58f6ff', size = 0.018, spread = 3.5, opacity = 0.16, speed = 0.4 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread * 2
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    return arr
  }, [count, spread])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.08
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.35) * 0.07
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

export default function FloatingParticles({ className = '', count = 400, color = '#58f6ff', size = 0.018, spread = 3.5, opacity = 0.16, speed = 0.4 }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <Particles count={count} color={color} size={size} spread={spread} opacity={opacity} speed={speed} />
      </Canvas>
    </div>
  )
}
