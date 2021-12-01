import { Plane, useTexture } from '@react-three/drei'
import React, { useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'

export default function Cursor() {
  const ref = useRef()
  useCursor((x, y) => {
    ref.current.position.set(x, y, 0)
  })
  const textureOpen = useTexture('/img/glove-open.png')
  const texturePinch = useTexture('/img/glove-pinch.png')
  const [clicked, setClicked] = useState(false)
  const bind = {
    onPointerDown: (e) => {
      setClicked(true)
      e.target.setPointerCapture(e.pointerId)
    },
    onPointerUp: () => setClicked(false),
    onPointerMove: () => {
      ref.current.visible = true
    },
  }
  return (
    <group ref={ref} scale={[0.5, 0.5, 0.5]} visible={false}>
      <mesh renderOrder={Infinity} position={[0.3, -0.15, 0]}>
        <planeBufferGeometry />
        <meshBasicMaterial
          map={clicked ? texturePinch : textureOpen}
          depthTest={false}
          transparent
        />
      </mesh>
      <Plane {...bind} args={[100, 100]} visible={false} />
    </group>
  )
}

export function useCursor(callback) {
  useFrame(({ mouse, viewport }) => {
    const { width, height } = viewport()
    callback((mouse.x * width) / 2, (mouse.y * height) / 2)
  })
}
