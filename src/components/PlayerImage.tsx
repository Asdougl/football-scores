import { faCircleUser } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import type { FC } from 'react'
import { useState } from 'react'
import type { LiveMatchTeamPlayer } from '../types/liveMatch'

export const PlayerImage: FC<{ player: LiveMatchTeamPlayer }> = ({
  player,
}) => {
  const [error, setError] = useState(false)

  return player.PlayerPicture && !error ? (
    <Image
      src={player.PlayerPicture.PictureUrl}
      alt={player.ShortName[0]?.Description || `Player ${player.ShirtNumber}`}
      width={30}
      height={30}
      onError={() => setError(true)}
      className="rounded-full"
      style={{
        objectFit: 'cover',
        height: '30px',
        width: '30px',
      }}
    />
  ) : (
    <FontAwesomeIcon icon={faCircleUser} className="text-3xl text-slate-300" />
  )
}
