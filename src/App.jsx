import { tw, css, animation, apply } from 'twind/css'
import React, { Suspense, useReducer } from 'react'
import { Canvas } from 'react-three-fiber'
import { Preload } from '@react-three/drei'
import { ResizeObserver } from '@juggle/resize-observer'

import { useTheme } from '@/hooks/useTheme'
import { useSound } from '@/hooks/useSound'

import Effects from '@/components/Effects'
import Background from '@/components/Background'
import Cursor from '@/components/Cursor'
import Mario from '@/components/Mario'
import PressStart from '@/components/PressStart'
import Coin from '@/components/Coin'
import Title from '@/components/Title'
import ClickToStart from '@/components/ClickToStart'
import Float from '@/components/Float'

const aspectCRT = css`
  width: 100vw;
  height: calc(100vw * 3 / 4);
  max-height: 100vh;
  max-width: calc(100vh * 4 / 3);
`

const wipeIn = animation('1s linear forwards', {
  from: { maskSize: '0 0' },
  to: { maskSize: '400% 400%' },
})

const masked = css`
  mask-image: url(/img/star-mask.png);
  mask-position: center center;
  mask-repeat: no-repeat;
  mask-size: 0 0;
`

const absoluteChildren = css`
  & > * {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`

const noTouch = css`
  touch-action: none;
`

export default function App() {
  const [state, advance] = useReducer((x) => x + 1, 0)
  const [theme, themePlaying] = useTheme()
  const [btnLocked, toggle] = useReducer((x) => !x, false)
  const transitionSound = useSound('/audio/transition.mp3')

  const stateWaiting = state === 0
  const stateTitle = state === 1
  const statePlay = state === 2

  const queueStart = () => {
    setTimeout(() => {
      !themePlaying() && theme.play()
      !themePlaying() && transitionSound.play()
      stateTitle && advance()
    }, 1000)
  }

  return (
    <div
      className={tw`bg-black text-white h-screen w-screen grid place-items-center ${noTouch}`}
    >
      <div
        className={tw`${aspectCRT} overflow-hidden relative ${absoluteChildren} ${
          statePlay && 'cursor-none'
        }`}
      >
        <div className={tw`${masked} ${statePlay && wipeIn}`}>
          <CanvasContent started={statePlay} btnLocked={btnLocked} />
        </div>
        {stateTitle && <Title onComplete={queueStart} />}
        {stateWaiting && (
          <ClickToStart visible={stateWaiting} onClick={advance} />
        )}
      </div>
      <LockButton locked={btnLocked} onClick={toggle} ready={statePlay} />
    </div>
  )
}

function CanvasContent({ started, btnLocked }) {
  return (
    <Canvas
      concurrent
      resize={{ polyfill: ResizeObserver }}
      camera={{ fov: 50, position: [0, 0, 3.5] }}
      className={tw(
        css`
          transform: scale(1.02);
        `
      )}
    >
      <Suspense fallback={null}>
        <Preload all />
        <Effects />
        <Cursor />
        <PressStart />
        <Coin />
        <Background />
        <Float>
          <Mario started={started} btnLocked={btnLocked} />
        </Float>
        <ambientLight intensity={0.3} />
        <pointLight position={[-2, 2, 3]} />
      </Suspense>
    </Canvas>
  )
}

function LockButton({ locked, onClick, ready }) {
  return (
    <div
      className={tw(
        'fixed bottom-0 w-full flex justify-center p-6 sm:hidden transition-opacity',
        !ready && 'opacity-0'
      )}
    >
      <button
        className={tw(
          'border-2 px-3 py-1 rounded-lg bg-white w-28',
          'focus:outline-none focus:(ring ring-blue-400)',
          locked
            ? 'bg-opacity-90 hover:bg-opacity-100 text-black'
            : 'bg-opacity-0 hover:bg-opacity-10 text-white'
        )}
        onClick={onClick}
      >
        {locked ? 'Unlock' : 'Lock'}
      </button>
    </div>
  )
}
