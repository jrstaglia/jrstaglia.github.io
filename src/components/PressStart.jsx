import { useTexture } from '@react-three/drei'
import React, { useEffect, useReducer } from 'react'
import { useThree } from 'react-three-fiber'

export default function PressStart(props) {
  const texture = useTexture('/img/press-start.png')
  const [visible, toggle] = useReducer((x) => !x, true)
  useEffect(() => {
    const interval = setInterval(toggle, 700)
    return () => clearInterval(interval)
  }, [])
  const { viewport } = useThree()
  const x = -viewport.width / 2 + 0.8
  const y = -viewport.height / 2 + 0.5
  const s = 0.8
  return (
    <mesh visible={visible} position={[x, y, 0]} scale={[s, s, s]}>
      <planeBufferGeometry />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  )
}
