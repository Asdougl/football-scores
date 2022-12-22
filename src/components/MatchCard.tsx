import classNames from 'classnames'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { FC } from 'react'
import { MatchPeriod } from '../types/liveMatch'
import type { PotentialMatch } from '../types/match'
import { MatchStatus } from '../types/match'
import { isInternational } from '../utils/leagues'

import { trpc } from '../utils/trpc'
import { ClubCrest } from './ClubCrest'

type MatchStatusText = 'upcoming' | 'live' | 'finished'

const matchStatus = (match: PotentialMatch): MatchStatusText => {
  if (match.MatchStatus === MatchStatus.UPCOMING) {
    return 'upcoming'
  } else if (match.MatchStatus === MatchStatus.LIVE) {
    return 'live'
  } else {
    return 'finished'
  }
}

export const MatchCard: FC<{ match: PotentialMatch }> = ({ match }) => {
  const status = matchStatus(match)

  const matchDate = dayjs(match.Date)

  const { data } = trpc.live.liveMatch.useQuery(
    { matchId: match.IdMatch },
    { enabled: match.MatchStatus === MatchStatus.LIVE, refetchInterval: 30000 }
  )

  const international = isInternational(match.IdCompetition)

  const penalties = !!(
    match.ResultType === 2 ||
    (match.HomeTeamPenaltyScore && match.HomeTeamPenaltyScore > 0) ||
    (match.AwayTeamPenaltyScore && match.AwayTeamPenaltyScore > 0)
  )

  return (
    <Link
      href={`/match/${match.IdMatch}`}
      className={classNames(
        'flex w-full flex-col gap-2 rounded-lg border-2 bg-white px-5 py-3 ring-indigo-500 drop-shadow hover:bg-slate-50 focus:ring ',
        status === 'live' ? 'border-purple-500' : 'border-transparent'
      )}
    >
      <div className="flex w-full gap-2 opacity-60 lg:justify-center">
        <span>{match.CompetitionName[0]?.Description}</span>
        &bull;
        <span>
          {match.MatchDay
            ? `Match Day ${match.MatchDay}`
            : match.StageName[0]?.Description}
        </span>
      </div>
      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <div className="flex items-center justify-between gap-4 lg:hidden">
          {match.MatchStatus !== MatchStatus.UPCOMING ? (
            match.MatchStatus === MatchStatus.LIVE && data ? (
              <>
                <div className="font-bold text-purple-500">Live</div>
                {data.Period === MatchPeriod.HALF_TIME ? (
                  <div className="text-xs text-purple-500">Half Time</div>
                ) : (
                  <div className="animate-pulse rounded bg-purple-500 bg-opacity-20 px-2 text-sm text-purple-500">
                    {data.MatchTime}
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs opacity-60">Full Time</div>
            )
          ) : (
            <>
              <div className="">{matchDate.format('HH:mm')}</div>
              <div className="text-sm opacity-60">
                {matchDate.format('D MMM')}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-1 items-center gap-3 lg:flex-row-reverse">
          <ClubCrest
            imgUrl={match.Home?.PictureUrl}
            alt={match.Home?.Abbreviation}
            size="sm"
            international={international}
          />
          <div className="text-right text-xl">
            {match.Home
              ? match.Home.TeamName[0]?.Description || match.Home.ShortClubName
              : match.PlaceHolderA}
          </div>
          <div className="flex flex-grow items-center justify-end text-right text-xl lg:hidden">
            <div className="w-4 text-center">
              {match.MatchStatus !== MatchStatus.UPCOMING &&
                match.HomeTeamScore}
            </div>
            {penalties && (
              <span className="pl-1 text-sm">
                ({match.HomeTeamPenaltyScore})
              </span>
            )}
          </div>
        </div>
        <div className="hidden w-40 flex-col items-center justify-center text-center lg:flex">
          {match.MatchStatus !== MatchStatus.UPCOMING ? (
            <>
              <div className="flex items-center gap-2 text-3xl">
                <span className="text-base">
                  {penalties && `(${match.HomeTeamPenaltyScore})`}
                </span>
                {match.HomeTeamScore} : {match.AwayTeamScore}
                <span className="text-base">
                  {penalties && `(${match.AwayTeamPenaltyScore})`}
                </span>
              </div>
              <div>
                {match.MatchStatus === MatchStatus.LIVE && data ? (
                  data.Period === MatchPeriod.HALF_TIME ? (
                    <div className="text-sm text-purple-500">Half Time</div>
                  ) : (
                    <div className="animate-pulse rounded bg-purple-500 bg-opacity-20 px-2 text-purple-500">
                      {data.MatchTime}
                    </div>
                  )
                ) : (
                  <div className="text-sm opacity-60">Full Time</div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl tracking-wide">
                {matchDate.format('HH:mm')}
              </div>
              <div className="text-sm opacity-60">
                {matchDate.format('D MMM')}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-1 items-center justify-start gap-3">
          <ClubCrest
            imgUrl={match.Away?.PictureUrl}
            alt={match.Away?.Abbreviation}
            size="sm"
            international={international}
          />
          <div className="hidden text-right text-xl lg:block">
            {match.Away
              ? match.Away.TeamName[0]?.Description || match.Away.ShortClubName
              : match.PlaceHolderB}
          </div>
          <div className="text-xl lg:hidden">
            {match.Away ? match.Away.ShortClubName : match.PlaceHolderB}
          </div>
          <div className="flex flex-grow items-center justify-end text-right text-xl lg:hidden">
            <div className="w-4 text-center">
              {match.MatchStatus !== MatchStatus.UPCOMING &&
                match.AwayTeamScore}
            </div>
            {penalties && (
              <span className="pl-1 text-sm">
                ({match.AwayTeamPenaltyScore})
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
