import { faC, faCircle } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { FC } from 'react'
import type { LiveMatch, LiveMatchTeamPlayer } from '../types/liveMatch'

const Player = ({
  player,
  home,
}: {
  player: LiveMatchTeamPlayer
  home: boolean
}) => (
  <li
    key={player.IdPlayer}
    className={`mb-2 flex items-center text-lg ${
      home ? 'flex-row' : 'flex-row-reverse'
    }`}
  >
    <div className="relative flex w-8 items-center justify-center"></div>
    <div className="w-10 text-center">
      {player.ShirtNumber === 0 ? '-' : player.ShirtNumber}
    </div>
    <div
      className={`flex items-center ${home ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <span>{player.PlayerName[0]?.Description}</span>
      {player.Captain && (
        <div className="relative h-1 w-8 px-2">
          <FontAwesomeIcon
            icon={faCircle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500"
          />
          <FontAwesomeIcon
            icon={faC}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white"
          />
        </div>
      )}
    </div>
  </li>
)

const determineLineup = (
  players: LiveMatchTeamPlayer[]
): [starting: LiveMatchTeamPlayer[], subs: LiveMatchTeamPlayer[]] => {
  const starting: LiveMatchTeamPlayer[] = []
  const subs: LiveMatchTeamPlayer[] = []

  players.forEach((player) => {
    if (player.FieldStatus === 1) {
      starting.push(player)
    } else {
      subs.push(player)
    }
  })
  return [starting, subs]
}

export const SimpleLineUp: FC<{ match: LiveMatch }> = ({ match }) => {
  if (!match.HomeTeam.Players.length || !match.AwayTeam.Players.length) {
    return (
      <div className="relative w-full gap-4 text-center text-lg opacity-70 lg:py-12">
        <p>Lineups will be</p>
        <p>posted prior to kickoff</p>
      </div>
    )
  }

  const [homeStarters, homeSubs] = determineLineup(match.HomeTeam.Players)
  const [awayStarters, awaySubs] = determineLineup(match.AwayTeam.Players)

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4">
      <h4 className="mb-2 text-lg font-bold">
        {match.HomeTeam.TeamName[0]?.Description ||
          match.HomeTeam.ShortClubName}
      </h4>
      <h4 className="mb-2 text-right text-lg font-bold">
        {match.AwayTeam.TeamName[0]?.Description ||
          match.AwayTeam.ShortClubName}
      </h4>

      <h5 className="col-span-2 text-center">Starting</h5>
      <ul>
        {homeStarters.map((player) => (
          <Player player={player} key={player.IdPlayer} home={true} />
        ))}
      </ul>
      <ul>
        {awayStarters.map((player) => (
          <Player player={player} key={player.IdPlayer} home={false} />
        ))}
      </ul>

      <h5 className="col-span-2 text-center">Substitutions</h5>
      <ul>
        {homeSubs.map((player) => (
          <Player player={player} key={player.IdPlayer} home={true} />
        ))}
      </ul>
      <ul>
        {awaySubs.map((player) => (
          <Player player={player} key={player.IdPlayer} home={false} />
        ))}
      </ul>
    </div>
  )
}
