import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { Plane, useTexture } from '@react-three/drei'
import { useThree } from 'react-three-fiber'
import meta from '../../package.json'

export default function Coin() {
  const sprites = useTexture([...Array(4)].map((_, i) => `/img/coin/${i}.png`))
  const [sprite, setSprite] = useState(sprites[0])
  const interval = useRef()
  const { viewport } = useThree()
  const x = viewport.width / 2 - 0.6
  const y = -viewport.height / 2 + 0.5
  const s = 0.3
  const bind = {
    onPointerOver: () => {
      let i = 0
      interval.current = setInterval(() => {
        setSprite(sprites[i++ % sprites.length])
      }, 100)
    },
    onPointerOut: () => {
      clearInterval(interval.current)
      setSprite(sprites[0])
    },
    onClick: () => {
      window.location.href = meta.repository.url
    },
  }
  return (
    <Plane position={[x, y, 0]} scale={[s, s, s]} {...bind}>
      <meshBasicMaterial map={sprite} transparent depthWrite={false} />
    </Plane>
  )
}
