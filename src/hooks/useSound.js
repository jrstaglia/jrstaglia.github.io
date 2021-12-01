import { Howl } from 'howler'
import { useMemo } from 'react'

export function useSound(path, options = {}) {
  const sound = useMemo(() => {
    const sound = new Howl({ src: [path], volume: 0.5, ...options })
    return sound
  }, [path, options])

  return sound
}
