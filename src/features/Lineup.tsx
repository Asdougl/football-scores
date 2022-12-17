import type { FC } from 'react'
import type { LiveMatch } from '../types/liveMatch'
const STD_WIDTH = 68
const STD_HEIGHT = 105

export const LineUp: FC<{ match: LiveMatch }> = ({ match }) => {
  const homeStarters = match.HomeTeam.Players.filter((player) => {
    return player.Status === 1
  })

  const awayStarters = match.AwayTeam.Players.filter((player) => {
    return player.Status === 1
  })

  if (!homeStarters.length || !awayStarters.length) {
    return (
      <div className="relative w-full gap-4 py-12 text-center text-lg opacity-70">
        <p>Lineups will be</p>
        <p>posted before the match</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-[512px] bg-green-700 py-6 text-center text-xl">
          <div className="opacity-80">{match.HomeTeam.ShortClubName}</div>
        </div>
        <div
          className="relative grid w-full max-w-[512px] grid-rows-2 gap-8 border-2 border-white/60 bg-green-500 p-8"
          style={{ aspectRatio: '1 / 1.54' }}
        >
          <div className="absolute top-1/2 left-0 w-full border-t-2 border-white/60"></div>
          {/* top d */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60"
            style={{
              width: `${((9.15 * 2) / STD_WIDTH) * 100}%`,
              height: `${((9.15 * 2) / STD_HEIGHT) * 100}%`,
              top: `${(11 / STD_HEIGHT) * 100}%`,
            }}
          ></div>
          {/* bottom d */}
          <div
            className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white/60"
            style={{
              width: `${((9.15 * 2) / STD_WIDTH) * 100}%`,
              height: `${((9.15 * 2) / STD_HEIGHT) * 100}%`,
              bottom: `${(11 / STD_HEIGHT) * 100}%`,
            }}
          ></div>
          {/* top penalty box */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 border-2 border-t-0 border-white/60 bg-green-500"
            style={{
              width: `${(40.32 / STD_WIDTH) * 100}%`,
              height: `${(16.5 / STD_HEIGHT) * 100}%`,
            }}
          ></div>
          {/* bottom penalty box */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 border-2 border-b-0 border-white/60 bg-green-500"
            style={{
              width: `${(40.32 / STD_WIDTH) * 100}%`,
              height: `${(16.5 / STD_HEIGHT) * 100}%`,
            }}
          ></div>
          {/* top 6 yard box */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 border-2 border-t-0 border-white/60"
            style={{
              width: `${(18.32 / STD_WIDTH) * 100}%`,
              height: `${(5.5 / STD_HEIGHT) * 100}%`,
            }}
          ></div>
          {/* bottom 6 yard box */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 border-2 border-b-0 border-white/60"
            style={{
              width: `${(18.32 / STD_WIDTH) * 100}%`,
              height: `${(5.5 / STD_HEIGHT) * 100}%`,
            }}
          ></div>
          {/* top penalty spot */}
          <div
            className="absolute left-1/2 h-1 w-1 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white/60"
            style={{ bottom: `${(11 / STD_HEIGHT) * 100}%` }}
          ></div>
          {/* bottom penalty spot */}
          <div
            className="absolute left-1/2 h-1 w-1 translate-y-1/2 -translate-x-1/2 rounded-full bg-white/60"
            style={{ top: `${(11 / STD_HEIGHT) * 100}%` }}
          ></div>
          {/* centre circle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60"
            style={{
              width: `${((9.15 * 2) / STD_WIDTH) * 100}%`,
              height: `${((9.15 * 2) / STD_HEIGHT) * 100}%`,
            }}
          ></div>
          <div className="relative">
            {homeStarters.map((player) => (
              <div
                key={player.IdPlayer}
                className="absolute flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-red-500"
                style={{
                  top: `${((player.LineupY || 0) / 13) * 100}%`,
                  right: `${((player.LineupX || 0) / 20) * 100}%`,
                }}
              >
                <div className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap pt-1 text-center text-xs font-bold lg:text-sm">
                  {player.ShortName[0]?.Description}
                </div>
                <div>{player.ShirtNumber}</div>
              </div>
            ))}
          </div>
          <div className="relative">
            {awayStarters.map((player) => (
              <div
                key={player.IdPlayer}
                className="absolute flex h-8 w-8 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-blue-500"
                style={{
                  bottom: `${((player.LineupY || 0) / 13) * 100}%`,
                  left: `${((player.LineupX || 0) / 20) * 100}%`,
                }}
              >
                <div className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap pt-1 text-center text-xs font-bold lg:text-sm">
                  {player.ShortName[0]?.Description}
                </div>
                <div>{player.ShirtNumber}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-[512px] bg-green-700 py-6 text-center text-xl">
          <div className="opacity-80">{match.AwayTeam.ShortClubName}</div>
        </div>
      </div>
    </div>
  )
}
