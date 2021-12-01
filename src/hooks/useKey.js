import { useEffect, useState } from 'react'

export default function useKey(code, { onPress, onRelease }) {
  const [pressed, setPressed] = useState(false)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === code) {
        setPressed(true)
        onPress && onPress()
      }
    }
    const onKeyUp = (e) => {
      if (e.code === code) {
        setPressed(false)
        onRelease && onRelease()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [code, onPress, onRelease])
  return pressed
}
