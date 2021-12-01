import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'

export default function Float(props) {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.02
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.01
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 1.7) * 0.02
  })
  return <group ref={ref} {...props} />
}
