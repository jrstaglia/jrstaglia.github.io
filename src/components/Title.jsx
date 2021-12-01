import { tw } from 'twind'
import React, { useRef, useState } from 'react'
import { a, useChain, useSpring } from '@react-spring/web'
import { useSound } from '@/hooks/useSound'

export default function Title({ onComplete }) {
  const startSound = useSound('/audio/its-a-me-mario.mp3')
  const [attribution, setAttribution] = useState(false)
  const entranceRef = useRef()
  const spring = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: {
      friction: 20,
      tension: 1200,
    },
    onStart: () => startSound.play(),
    onRest: () => setAttribution(true),
    ref: entranceRef,
  })
  const exitRef = useRef()
  const exit = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    ref: exitRef,
    config: {
      duration: 500,
    },
    onRest: onComplete,
  })
  useChain([entranceRef, exitRef], [1, 4])
  return (
    <a.div
      style={{ ...spring, ...exit }}
      className={tw('w-full h-full relative')}
    >
      <img className={tw`h-full w-full absolute`} src="/img/title/logo.png" />
      <img
        className={tw(
          'h-full w-full absolute transition-opacity opacity-0',
          attribution && 'opacity-100'
        )}
        src="/img/title/attribution.png"
      />
    </a.div>
  )
}
