import React from 'react'
import { tw } from 'twind'

export default function ClickToStart({ onClick }) {
  return (
    <button
      className={tw('grid place-items-center text-center z-10')}
      onClick={onClick}
    >
      <div>
        <p className={tw`animate-pulse text-white font-bold text-4xl`}>
          Click to start
        </p>
        <p className={tw`opacity-70`}>Fan made site, not a Nintendo product</p>
        <p className={tw`opacity-70 font-light text-sm mt-4`}>
          Desktop user? Spacebar is your friend.
        </p>
      </div>
    </button>
  )
}
