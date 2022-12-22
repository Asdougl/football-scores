import {
  faFutbolBall,
  faCardsBlank,
  faCardDiamond,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { CSSProperties, FC, ReactNode } from 'react'
import classNames from 'classnames'
import { useMemo } from 'react'
import {
  faArrowRight,
  faArrowLeft,
  faWhistle,
} from '@fortawesome/pro-solid-svg-icons'
import { faGoalNet } from '@fortawesome/pro-regular-svg-icons'
import type { TimelineEvent } from '../types/timeline'
import { isPenaltyShootout, EventType } from '../types/timeline'

import type { LiveMatchTeam, LiveMatchTeamPlayer } from '../types/liveMatch'

const SummaryEntry: FC<{
  team: 'home' | 'away'
  items: { icon: ReactNode; label: string }[]
  time: string
}> = ({ team, items, time }) => (
  <div
    className={classNames('group flex w-full', {
      'flex-row-reverse': team === 'away',
    })}
  >
    <div className="flex flex-1 flex-col justify-end py-2">
      {items.map(({ icon, label }) => (
        <div
          key={label}
          className={classNames('flex flex-1 items-end justify-end gap-2', {
            'flex-row-reverse': team === 'away',
            'text-right': team === 'home',
          })}
        >
          {label} <span className="h-auto px-2">{icon}</span>
        </div>
      ))}
    </div>
    <div className="flex w-16 flex-col items-center justify-center">
      <div className="h-3 w-[2px] flex-grow bg-pink-500 group-first:hidden"></div>
      <div className="py-2">{time}</div>
    </div>
    <div className="flex-1"></div>
  </div>
)

interface SummaryProps {
  events: TimelineEvent[]
  home: LiveMatchTeam
  away: LiveMatchTeam
}

export const Summary = ({ events, home, away }: SummaryProps) => {
  const summaryEvents = useMemo(() => {
    const allPlayers = [...home.Players, ...away.Players]

    const summaryEvents: JSX.Element[] = []
    events.forEach((event) => {
      if (
        isPenaltyShootout(event.MatchMinute) &&
        (event.Type === EventType.CONVERTED_PENALTY ||
          event.Type === EventType.MISSED_PENALTY ||
          event.Type === EventType.SAVED_PENALTY)
      ) {
        const player = allPlayers.find(
          (player) => player.IdPlayer === event.IdPlayer
        )

        const homeTeam = event.IdTeam === home.IdTeam

        const scored = event.Type === EventType.CONVERTED_PENALTY

        let label = `${
          player?.PlayerName[0]?.Description ||
          (homeTeam ? home.ShortClubName : away.ShortClubName)
        }`
        if (!scored) {
          label += ` ${event.Type === EventType.SAVED_PENALTY ? '(S)' : '(M)'}`
        }

        const entry = (
          <SummaryEntry
            team={homeTeam ? 'home' : 'away'}
            key={event.EventId}
            items={[
              {
                icon: (
                  <div className="relative">
                    <FontAwesomeIcon icon={faGoalNet} fixedWidth />
                    <FontAwesomeIcon
                      icon={scored ? faCheckCircle : faTimesCircle}
                      className={classNames(
                        'absolute top-full left-full -translate-x-1/2 -translate-y-full transform',
                        scored ? 'text-green-500' : 'text-red-500'
                      )}
                      style={
                        {
                          '--fa-secondary-color': 'white',
                          '--fa-secondary-opacity': 1.0,
                        } as CSSProperties
                      }
                    />
                  </div>
                ),
                label: label,
              },
            ]}
            time={event.MatchMinute}
          />
        )

        summaryEvents.push(entry)
      } else if (
        event.Type === EventType.GOAL ||
        event.Type === EventType.CONVERTED_PENALTY ||
        event.Type === EventType.OWN_GOAL
      ) {
        const player = allPlayers.find(
          (player) => player.IdPlayer === event.IdPlayer
        )

        const homeTeam = event.IdTeam === home.IdTeam

        const entry = (
          <SummaryEntry
            team={homeTeam ? 'home' : 'away'}
            key={event.EventId}
            items={[
              {
                icon: (
                  <FontAwesomeIcon
                    icon={
                      event.Type !== EventType.CONVERTED_PENALTY
                        ? faFutbolBall
                        : faGoalNet
                    }
                    fixedWidth
                    style={
                      {
                        '--fa-secondary-color': 'transparent',
                      } as CSSProperties
                    }
                  />
                ),
                label: `${
                  player?.PlayerName[0]?.Description ||
                  (homeTeam ? home.ShortClubName : away.ShortClubName)
                } ${event.Type === EventType.OWN_GOAL ? '(OG)' : ''}`,
              },
            ]}
            time={event.MatchMinute}
          />
        )

        summaryEvents.push(entry)
      } else if (
        event.Type === EventType.YELLOW ||
        event.Type === EventType.STRAIGHT_RED ||
        event.Type === EventType.SECOND_YELLOW
      ) {
        const player = allPlayers.find(
          (player) => player.IdPlayer === event.IdPlayer
        )

        const homeTeam = event.IdTeam === home.IdTeam

        const entry = (
          <SummaryEntry
            team={homeTeam ? 'home' : 'away'}
            key={event.EventId}
            items={[
              {
                icon: (
                  <FontAwesomeIcon
                    icon={
                      event.Type === EventType.SECOND_YELLOW
                        ? faCardsBlank
                        : faCardDiamond
                    }
                    className={classNames({
                      'text-yellow-500': event.Type === EventType.YELLOW,
                      'text-red-500':
                        event.Type === EventType.STRAIGHT_RED ||
                        event.Type === EventType.SECOND_YELLOW,
                    })}
                    style={
                      {
                        '--fa-secondary-color':
                          event.Type === EventType.YELLOW ||
                          event.Type === EventType.SECOND_YELLOW
                            ? '#eab308'
                            : event.Type === EventType.STRAIGHT_RED
                            ? '#ef4444'
                            : 'transparent',
                        '--fa-secondary-opacity': 1.0,
                      } as CSSProperties
                    }
                    fixedWidth
                  />
                ),
                label: `${
                  player?.PlayerName[0]?.Description ||
                  (homeTeam ? home.ShortClubName : away.ShortClubName)
                }`,
              },
            ]}
            time={event.MatchMinute}
          />
        )

        summaryEvents.push(entry)
      } else if (event.Type === EventType.SUBSTITUTION) {
        let playerIn: LiveMatchTeamPlayer | null = null
        let playerOut: LiveMatchTeamPlayer | null = null

        for (const player of allPlayers) {
          if (!playerIn && player.IdPlayer === event.IdPlayer) {
            playerIn = player
          }

          if (!playerOut && player.IdPlayer === event.IdSubPlayer) {
            playerOut = player
          }

          if (playerIn && playerOut) {
            break
          }
        }

        const homeTeam = event.IdTeam === home.IdTeam

        const entry = (
          <SummaryEntry
            team={homeTeam ? 'home' : 'away'}
            key={event.EventId}
            items={[
              {
                icon: (
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-red-500"
                    fixedWidth
                  />
                ),
                label:
                  playerOut?.PlayerName[0]?.Description ||
                  (homeTeam ? home.ShortClubName : away.ShortClubName),
              },
              {
                icon: (
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-green-500"
                    fixedWidth
                  />
                ),
                label:
                  playerIn?.PlayerName[0]?.Description ||
                  (homeTeam ? home.ShortClubName : away.ShortClubName),
              },
            ]}
            time={event.MatchMinute}
          />
        )
        summaryEvents.push(entry)
      } else if (event.Type === EventType.FINAL_WHISTLE) {
        const entry = (
          <SummaryEntry
            team="home"
            key={event.EventId}
            items={[
              {
                icon: <FontAwesomeIcon icon={faWhistle} fixedWidth />,
                label: 'Final Whistle',
              },
            ]}
            time={event.MatchMinute}
          />
        )
        summaryEvents.push(entry)
      }
    })

    return summaryEvents
  }, [events, home, away])

  if (summaryEvents.length === 0) {
    return (
      <div className="relative w-full gap-4 text-center text-lg opacity-70 lg:py-12">
        <p>Summary will be</p>
        <p>updated throughout the match</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {summaryEvents}
      <SummaryEntry
        team="home"
        items={[
          {
            icon: <FontAwesomeIcon icon={faWhistle} fixedWidth />,
            label: 'Kickoff',
          },
        ]}
        time="0'"
      />
    </div>
  )
}
