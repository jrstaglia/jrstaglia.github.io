import React, { useEffect, useRef } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { BadTVShader } from '@/shaders/BadTVShader'
import { FilmShader } from '@/shaders/FilmShader'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

extend({ BloomPass, RenderPass, ShaderPass, EffectComposer })

export default function Effects() {
  const composer = useRef()
  const badTVPass = useRef()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => void composer.current.setSize(size.width, size.height), [
    size,
  ])
  useFrame(({ clock }) => {
    badTVPass.current.uniforms['time'].value = clock.elapsedTime
    composer.current.render()
  }, 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <bloomPass attachArray="passes" args={[1.2, 5, 0.5, 700]} />
      <shaderPass
        attachArray="passes"
        args={[BadTVShader]}
        ref={badTVPass}
        uniforms-distortion-value={0.2}
        uniforms-distortion2-value={0.5}
        uniforms-speed-value={3}
        uniforms-rollSpeed-value={0}
      />
      <shaderPass
        attachArray="passes"
        args={[RGBShiftShader]}
        uniforms-amount-value={0.001}
        uniforms-angle-value={1}
      />
      <shaderPass
        attachArray="passes"
        args={[FilmShader]}
        uniforms-grayscale-value={false}
        uniforms-sCount-value={800}
        uniforms-sIntensity-value={0.5}
        uniforms-nIntensity-value={0.1}
      />
    </effectComposer>
  )
}
