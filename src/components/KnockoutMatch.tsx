import dayjs from 'dayjs'
import Xarrow from 'react-xarrows'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { PotentialMatch } from '../types/match'
import { pictureUrl } from '../utils/picture'

interface KnockoutMatchProps {
  match: PotentialMatch
  winnerTo?: string
  loserTo?: string
  arrowOffset?: number
  league: string
  progress?: number
}

const arrowColor = (progress: number) => {
  const asPct = progress * 100
  if (asPct <= 34) {
    return '#6366f1'
  } else if (asPct <= 67) {
    return '#a855f7'
  } else {
    return '#ec4899'
  }
}

export const KnockoutMatch = ({
  match,
  winnerTo,
  loserTo,
  arrowOffset = 0,
  league,
  progress = 0,
}: KnockoutMatchProps) => {
  const [renderArrow, setRenderArrow] = useState(false)

  useEffect(() => {
    setRenderArrow(true)
  }, [])

  return (
    <div key={match.IdMatch} className="flex min-w-[200px] flex-col gap-2">
      <div className="flex flex-col items-start px-2 lg:flex-row lg:items-center lg:gap-3">
        <span>Game {match.MatchNumber}</span>
        <span className="text-sm opacity-70">
          {dayjs(match.Date).format('D MMM [at] HH:mm')}
        </span>
      </div>
      <Link
        href={`/${league}/${match.IdMatch}`}
        className="flex flex-col gap-4 rounded-lg border border-slate-100 bg-slate-100 py-2 drop-shadow-lg hover:bg-slate-50"
        id={`match-${match.MatchNumber}`}
      >
        <div
          className="flex items-center px-4"
          id={`${match.MatchNumber}-home`}
        >
          {match.Home ? (
            <>
              <Image
                height={16}
                width={24}
                src={pictureUrl(match.Home.PictureUrl, 4)}
                alt={match.Home.Abbreviation}
                className="rounded-sm"
              />
              <div className="ml-2 flex-1">
                <span
                  className={classNames('hidden lg:inline', {
                    'font-bold': match.Winner === match.Home.IdTeam,
                  })}
                >
                  {match.Home.TeamName[0]?.Description}
                </span>
                <span
                  className={classNames('lg:hidden', {
                    'font-bold': match.Winner === match.Home.IdTeam,
                  })}
                >
                  {match.Home.ShortClubName}
                </span>{' '}
                <span className="text-xs opacity-60">
                  {match.Home.Abbreviation}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="h-4 w-6 rounded-sm bg-slate-600" />
              <div className="ml-2 flex-1">{match.PlaceHolderA}</div>
            </>
          )}
          <div className="text-right font-bold">
            {match.Home ? match.Home.Score ?? '-' : '-'}
            {match.ResultType === 2 && (
              <span className="pl-1 text-sm font-normal opacity-70">
                ({match.HomeTeamPenaltyScore ?? '-'})
              </span>
            )}
          </div>
        </div>
        <div
          className="flex items-center px-4"
          id={`${match.MatchNumber}-away`}
        >
          {match.Away ? (
            <>
              <Image
                height={16}
                width={24}
                src={pictureUrl(match.Away.PictureUrl, 4)}
                alt={match.Away.Abbreviation}
                className="rounded-sm"
              />
              <div className="ml-2 flex-1">
                <span
                  className={classNames('hidden lg:inline', {
                    'font-bold': match.Winner === match.Away.IdTeam,
                  })}
                >
                  {match.Away.TeamName[0]?.Description}
                </span>
                <span
                  className={classNames('lg:hidden', {
                    'font-bold': match.Winner === match.Away.IdTeam,
                  })}
                >
                  {match.Away.ShortClubName}
                </span>{' '}
                <span className="text-xs opacity-60">
                  {match.Away.Abbreviation}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="h-4 w-6 rounded-sm bg-slate-600" />
              <div className="ml-2 flex-1">{match.PlaceHolderB}</div>
            </>
          )}
          <div className="text-right font-bold">
            {match.Away ? match.Away.Score ?? '-' : '-'}
            {match.ResultType === 2 && (
              <span className="pl-1 text-sm font-normal opacity-70">
                ({match.AwayTeamPenaltyScore ?? '-'})
              </span>
            )}
          </div>
        </div>
        {renderArrow && winnerTo && (
          <Xarrow
            start={`match-${match.MatchNumber}`}
            end={winnerTo}
            endAnchor="left"
            startAnchor="right"
            color={arrowColor(progress)}
            curveness={0.5}
            path="grid"
            _cpx1Offset={arrowOffset * 6}
            _cpx2Offset={arrowOffset * 6}
          />
        )}
        {renderArrow && loserTo && (
          <Xarrow
            start={`match-${match.MatchNumber}`}
            end={loserTo}
            endAnchor="left"
            startAnchor="right"
            color={arrowColor(progress)}
            curveness={0.5}
            path="grid"
            _cpx1Offset={arrowOffset * 6}
            _cpx2Offset={arrowOffset * 6}
          />
        )}
      </Link>
    </div>
  )
}
