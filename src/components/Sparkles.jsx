import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { useTexture } from '@react-three/drei'
import { MathUtils } from 'three'

export default function Sparkles({ position, ...props }) {
  const sprites = useTexture(
    [...Array(5)].map((_, i) => `/img/sparkles/${i}.png`)
  )
  const points = useRef()
  const t = useRef(Infinity)
  const initialAttribute = useRef()

  useLayoutEffect(() => {
    // First time around, save initial point positions
    if (!initialAttribute.current) {
      initialAttribute.current = points.current.geometry.attributes.position.clone()
    }
    // Then copy and randomize
    const positionAttribute = points.current.geometry.attributes.position
    for (let i = 0; i < positionAttribute.array.length; ++i) {
      positionAttribute.array[i] = initialAttribute.current.array[i]
      positionAttribute.array[i] += Math.random() - 0.5
    }
    positionAttribute.needsUpdate = true
    t.current = 0
  }, [position])

  // Animate sprite texture
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      points.current.material.map = sprites[i++ % sprites.length]
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useFrame((_, delta) => {
    t.current += delta
    points.current.scale.setScalar(t.current / 2)
    points.current.material.size = MathUtils.clamp(0.6 - t.current, 0, 1)
  })
  return (
    <points ref={points} position={position} {...props}>
      <circleBufferGeometry args={[0.3, 16]} />
      <pointsMaterial map={sprites[0]} transparent depthTest={false} />
    </points>
  )
}
