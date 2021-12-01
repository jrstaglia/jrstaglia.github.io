import { Howl } from 'howler'
import { useState } from 'react'

export function useTheme() {
  const [[start, isPlaying]] = useState(() => {
    const loop = new Howl({
      src: ['/audio/theme-loop.mp3'],
      volume: 0.5,
      loop: true,
    })
    const start = new Howl({
      src: ['/audio/theme-start.mp3'],
      volume: 0.5,
      onend: () => loop.play(),
    })
    const isPlaying = () => loop.playing()
    return [start, isPlaying]
  })
  return [start, isPlaying]
}
