import { useTexture } from '@react-three/drei'
import React, { useLayoutEffect } from 'react'
import { useThree } from 'react-three-fiber'
import { RepeatWrapping } from 'three'

export default function Background() {
  const { scene, aspect } = useThree()
  const texture = useTexture('/img/background.png')
  texture.wrapS = texture.wrapT = RepeatWrapping

  // Add small border to account for postprocessing artifacts
  // We'll cut this off by scaling up the canvas
  const e = 0.02
  texture.repeat.y = 1 + e
  texture.repeat.x = 1 + e
  texture.offset.x = -e / 2
  texture.offset.y = -e / 2

  useLayoutEffect(() => {
    scene.background = texture
  }, [])
  return null
}
