import random from 'lodash/random'
import { useEffect, useState } from 'react'

const loadingMessages = [
  'Kicking off',
  'Fielding a team',
  'Getting the ball rolling',
  'Waiting for VAR',
  'Waiting for the ref',
  'Tossing the coin',
  'Playing the whistle',
  'Explaining the offside rule',
  'Checking the pitch',
  'Refilling the water bottles',
  'Registing the players',
  'Finding the ball',
]

export const Loader = () => {
  const [msgIndex, setMsgIndex] = useState(
    random(0, loadingMessages.length - 1)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(random(0, loadingMessages.length - 1))
    }, 3000)

    return () => clearInterval(interval)
  })

  return (
    <div className="flex h-32 max-h-screen flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin animate-bounce rounded-full bg-black" />
      <span className="text-sm text-slate-600">
        {loadingMessages[msgIndex]}...
      </span>
    </div>
  )
}
