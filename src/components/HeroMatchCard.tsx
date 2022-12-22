import classNames from 'classnames'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { FC } from 'react'
import { MatchPeriod } from '../types/liveMatch'
import type { Match, MatchTeam } from '../types/match'
import { MatchStatus } from '../types/match'
import { isInternational } from '../utils/leagues'

import { trpc } from '../utils/trpc'
import { ClubCrest } from './ClubCrest'

const Team: FC<{ team: MatchTeam; home: boolean; international?: boolean }> = ({
  team,
  home,
  international,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="pb-2">
        <ClubCrest
          imgUrl={team.PictureUrl}
          alt={team.Abbreviation}
          size={international ? 'md' : 'lg'}
          international={international}
        />
      </div>
      <div className="text-center">{team.ShortClubName}</div>
      <div className="text-sm opacity-60">
        {!international ? (home ? 'Home' : 'Away') : team.Abbreviation}
      </div>
    </div>
  )
}

export const HeroMatchCard: FC<{
  match: Match
  className?: string
}> = ({ match, className }) => {
  const matchDate = dayjs(match.Date)

  const { data } = trpc.live.liveMatch.useQuery(
    {
      matchId: match.IdMatch,
    },
    { refetchInterval: 30000, enabled: match.MatchStatus === MatchStatus.LIVE }
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
        'flex w-72 flex-shrink-0 snap-center flex-col rounded-lg border-2 bg-white py-4 px-6 drop-shadow hover:bg-slate-50',
        match.MatchStatus === MatchStatus.LIVE
          ? 'border-purple-500'
          : 'border-transparent',
        className
      )}
    >
      <div className="pb-2 text-center text-sm opacity-60">
        <div>{match.CompetitionName[0]?.Description}</div>
        {match.MatchDay ? (
          <div>Match Day {match.MatchDay}</div>
        ) : (
          <div>{match.StageName[0]?.Description}</div>
        )}
      </div>
      <div className="grid grid-cols-3">
        <Team team={match.Home} home international={international} />
        <div className="flex h-full flex-col items-center justify-center gap-4">
          {match.MatchStatus === MatchStatus.UPCOMING ? (
            <>
              <div className="text-lg">{matchDate.format('HH:mm')}</div>
              <div className="text-sm opacity-60">
                {matchDate.format('D MMM')}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl">
                {match.HomeTeamScore} : {match.AwayTeamScore}
                {penalties && (
                  <div className="text-center text-sm opacity-60">
                    ({match.HomeTeamPenaltyScore} : {match.AwayTeamPenaltyScore}
                    )
                  </div>
                )}
              </div>
              {match.MatchStatus === MatchStatus.LIVE ? (
                data?.Period === MatchPeriod.HALF_TIME ? (
                  <div className="rounded-lg bg-purple-500 bg-opacity-20 px-2 py-1 text-center text-sm font-bold text-purple-500">
                    <div>Half</div>
                    <div>Time</div>
                  </div>
                ) : (
                  <div className="animate-pulse rounded-lg bg-purple-500 bg-opacity-20 px-2 text-lg font-bold text-purple-500">
                    {data?.MatchTime}
                  </div>
                )
              ) : (
                <div className="text-sm opacity-60">Full Time</div>
              )}
            </>
          )}
        </div>
        <Team team={match.Away} home={false} international={international} />
      </div>
    </Link>
  )
}
