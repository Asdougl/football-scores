import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ClubCrest } from '../components/ClubCrest'
import { Loader } from '../components/Loader'
import { MatchPeriod } from '../types/liveMatch'
import { MatchStatus } from '../types/match'
import type { League } from '../utils/leagues'
import { trpc } from '../utils/trpc'
import { SimpleLineUp } from './SimpleLineup'
import { Summary } from './Summary'
import { Timeline } from './Timeline'

interface MatchDataProps {
  league: League
  matchId: string
  international?: boolean
}

export const MatchData = ({
  league,
  matchId,
  international,
}: MatchDataProps) => {
  const [tab, setTab] = useState<'summary' | 'timeline' | 'lineup'>('summary')

  const router = useRouter()

  const { data: match } = trpc.matches.oneMatch.useQuery(
    { matchId },
    { refetchInterval: 120000 }
  )
  const { data: fullMatch } = trpc.live.liveMatch.useQuery(
    { league, matchId },
    { refetchInterval: 30000 }
  )
  const { data: timeline } = trpc.live.timeline.useQuery(
    { league, matchId },
    { refetchInterval: 30000 }
  )

  if (!match || !timeline) return <Loader />

  const matchDate = dayjs(match.Date)

  const penalties =
    match.ResultType === 2 ||
    (match.HomeTeamPenaltyScore && match.HomeTeamPenaltyScore > 0) ||
    (match.AwayTeamPenaltyScore && match.AwayTeamPenaltyScore > 0)

  return (
    <>
      <button
        onClick={() => router.back()}
        role="link"
        className="group mb-6 flex items-center gap-2 font-bold ring-indigo-500 hover:underline focus:outline-none focus:ring"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="transition-transform group-hover:-translate-x-1"
        />{' '}
        Back
      </button>
      <div className="grid grid-cols-3 pb-8 lg:px-16">
        <div className="flex flex-col items-center gap-1 pt-4">
          <ClubCrest
            imgUrl={match.Home?.PictureUrl}
            alt={match.Home?.ShortClubName}
            international={international}
            size="lg"
          />
          {match.Home ? (
            <>
              <h2 className="hidden text-xl font-bold lg:block">
                {match.Home.TeamName[0]?.Description ||
                  match.Home.ShortClubName}
              </h2>
              <div className="opacity-60">
                {international ? match.Home.Abbreviation : 'Home'}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl">{match.PlaceHolderA}</h2>
            </>
          )}
        </div>
        <div className="flex flex-col items-center gap-4">
          {match.MatchStatus !== MatchStatus.UPCOMING ? (
            <>
              {match.MatchStatus === MatchStatus.LIVE ? (
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-purple-500">
                  <div className="relative h-2 w-2 rounded-full bg-purple-500">
                    <div className="absolute h-2 w-2 animate-ping rounded-full bg-purple-500 opacity-75"></div>
                  </div>
                  Live
                </div>
              ) : (
                <div className="text-sm">
                  {formatDistanceStrict(matchDate.toDate(), new Date(), {
                    addSuffix: true,
                  })}
                </div>
              )}
              <div className="flex items-center gap-1 lg:gap-4">
                {penalties && (
                  <span className="font-bold opacity-60 lg:text-2xl">
                    ({fullMatch?.HomeTeamPenaltyScore})
                  </span>
                )}
                <div className="grid grid-cols-3 text-4xl font-bold lg:text-6xl">
                  <span className="text-center">
                    {fullMatch?.HomeTeam.Score}
                  </span>
                  <span className="text-center">-</span>
                  <span className="text-center">
                    {fullMatch?.AwayTeam.Score}
                  </span>
                </div>
                {penalties && (
                  <span className="font-bold opacity-60 lg:text-2xl">
                    ({fullMatch?.AwayTeamPenaltyScore})
                  </span>
                )}
              </div>
              {match.MatchStatus === MatchStatus.LIVE ? (
                fullMatch?.Period === MatchPeriod.HALF_TIME ? (
                  <div className="rounded-lg bg-purple-500 bg-opacity-10 px-3 py-1 text-xl font-bold text-purple-500">
                    Half Time
                  </div>
                ) : (
                  <div className="rounded-lg bg-purple-500 bg-opacity-10 px-3 py-1 text-xl font-bold text-purple-500">
                    {fullMatch?.MatchTime}
                  </div>
                )
              ) : (
                <div className="rounded-lg bg-slate-100 px-3 py-1 text-xl font-bold">
                  Full Time
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-1 text-sm">
                {formatDistanceStrict(matchDate.toDate(), new Date(), {
                  addSuffix: true,
                })}
              </div>
              <div className="text-4xl font-bold lg:text-6xl">
                {matchDate.format('HH:mm')}
              </div>
              <div className="text-center text-2xl opacity-70">
                {matchDate.format('D MMM')}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 pt-4">
          <ClubCrest
            imgUrl={match.Away?.PictureUrl}
            alt={match.Away?.ShortClubName}
            international={international}
            size="lg"
          />
          {match.Away ? (
            <>
              <h2 className="hidden text-xl font-bold lg:block">
                {match.Away.TeamName[0]?.Description ||
                  match.Away.ShortClubName}
              </h2>
              <div className="opacity-60">
                {international ? match.Away.Abbreviation : 'Away'}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl">{match.PlaceHolderB}</h2>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 pb-6">
        <span className="opacity-60">{match.StageName[0]?.Description}</span>
        <span className="opacity-60">
          {match.Stadium.Name[0]?.Description},{' '}
          {match.Stadium.CityName[0]?.Description}{' '}
          {international && match.Stadium.IdCountry}
        </span>
      </div>
      {fullMatch && (
        <>
          <div className="flex flex-col items-start justify-center pb-6 lg:flex-row lg:items-center lg:gap-4">
            <button
              className={`${
                tab === 'summary' ? 'text-black' : 'text-gray-300'
              } rounded text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
              onClick={() => setTab('summary')}
            >
              Summary
            </button>
            <button
              className={`${
                tab === 'timeline' ? 'text-black' : 'text-gray-300'
              } rounded text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
              onClick={() => setTab('timeline')}
            >
              Timeline
            </button>
            <button
              className={`${
                tab === 'lineup' ? 'text-black' : 'text-gray-300'
              } rounded text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
              onClick={() => setTab('lineup')}
            >
              Lineup
            </button>
          </div>
          <div className="py-6">
            {tab === 'summary' && (
              <Summary
                events={timeline}
                home={fullMatch.HomeTeam}
                away={fullMatch.AwayTeam}
              />
            )}
            {tab === 'timeline' && <Timeline events={timeline} />}
            {tab === 'lineup' && <SimpleLineUp match={fullMatch} />}
          </div>
        </>
      )}
    </>
  )
}
