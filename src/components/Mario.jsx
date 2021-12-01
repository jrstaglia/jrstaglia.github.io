import React, { useRef, useState } from 'react'
import { useGLTF, Sphere, Plane } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
import { useCursor } from './Cursor'
import { createPortal, useThree } from 'react-three-fiber'
import { Vector3 } from 'three'
import { useGesture } from 'react-use-gesture'
import { useSound } from '@/hooks/useSound'
import Sparkles from '@/components/Sparkles'
import useKey from '@/hooks/useKey'
import { useEffect } from 'react'

const boneSizes = {
  CheekR: 0.35,
  CheekL: 0.35,
  EarR: 0.5,
  EarL: 0.5,
  Chin: 0.5,
  Hat: 0.8,
  Nose: 0.3,
}
const movableBones = Object.keys(boneSizes)

const vec = new Vector3()

export default function Mario({ clicked, started, btnLocked, ...props }) {
  const { size } = useThree()
  const { scene, nodes } = useGLTF('/gltf/mario.glb')
  // nodes.Mario.material.wireframe = true
  const { EyeL, EyeR } = nodes
  const [{ initPosition, needsReset }] = useState(() => {
    const initPosition = {}
    const needsReset = {}
    movableBones.forEach((name) => {
      initPosition[name] = nodes[name].position.clone()
      needsReset[name] = false
    })
    return { initPosition, needsReset }
  }, [])

  // Bone springs
  const boneSprings = {}
  movableBones.forEach((name) => {
    const [spring, set, stop] = useSpring(
      {
        position: initPosition[name].toArray(),
        onChange: (val) => nodes[name].position.fromArray(val),
        config: {
          friction: 10,
          tension: 300,
        },
      },
      []
    )
    boneSprings[name] = { spring, set, stop }
  })

  // Sparkle position (set triggers animation)
  const [sparklesPos, setSparklesPos] = useState([Infinity, Infinity, Infinity])

  useEye(EyeL)
  useEye(EyeR)

  const soundGrab = useSound('/audio/grab.mp3')
  const soundRelease = useSound('/audio/release.mp3')
  const grabbed = useRef()
  const bindHandles = {
    onPointerDown: (e) => {
      e.stopPropagation()
      if (!grabbed.current) {
        grabbed.current = e.object.parent
        const name = grabbed.current.name
        boneSprings[name].stop()
        needsReset[name] = true
        e.target.setPointerCapture(e.pointerId)
        soundGrab.play()
        setSparklesPos(e.point)
      }
    },
  }

  const resetBone = (name) => {
    boneSprings[name].set({
      from: { position: nodes[name].position.toArray() },
      to: { position: initPosition[name].toArray() },
    })
  }

  const releaseLock = () => {
    let anyMoved = false
    movableBones.forEach((name) => {
      if (grabbed.current?.name !== name && needsReset[name]) {
        resetBone(name)
        needsReset[name] = false
        anyMoved = true
      }
    })
    anyMoved && soundRelease.play()
  }

  const pressed = useKey('Space', {
    onRelease: () => !btnLocked && releaseLock(),
  })
  useEffect(() => {
    !btnLocked && releaseLock()
  }, [btnLocked])

  const bindPlane = useGesture({
    onDrag: ({ delta: [dx, dy] }) => {
      if (grabbed.current) {
        grabbed.current.position.x += dx / size.width
        grabbed.current.position.y -= dy / size.height
      }
    },
    onPointerUp: (e) => {
      if (grabbed.current) {
        const name = grabbed.current.name
        if (!(pressed || btnLocked)) {
          resetBone(name)
          soundRelease.play()
        }
        grabbed.current = null
      }
    },
  })
  return (
    <group>
      <EntranceAnimation start={started}>
        <a.primitive object={scene} {...props} />
      </EntranceAnimation>
      {movableBones.map((name) =>
        createPortal(
          <Sphere args={[boneSizes[name]]} {...bindHandles} visible={false}>
            <meshBasicMaterial wireframe color="white" />
          </Sphere>,
          nodes[name]
        )
      )}
      <Plane
        args={[100, 100]}
        position-z={2}
        {...bindPlane()}
        visible={false}
      />
      <Sparkles position={sparklesPos} />
    </group>
  )
}

function EntranceAnimation({ start, children }) {
  const spring = useSpring({
    from: { scale: [0, 0, 0] },
    to: { scale: [1, 1, 1] },
    config: {
      tension: 200,
      friction: 7,
    },
    delay: 500,
    pause: !start,
  })
  return <a.group {...spring}>{children}</a.group>
}

function useEye(bone) {
  const [initial] = useState(() => bone.position.clone())
  useCursor((x, y) => {
    bone.position.copy(initial)
    bone.getWorldPosition(vec)
    vec.x -= x
    vec.y -= y
    vec.z = 0
    vec.normalize().negate()

    bone.position.addScaledVector(vec, 0.1)
  })
}
