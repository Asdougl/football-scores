import dayjs from 'dayjs'
import Link from 'next/link'
import { useMemo } from 'react'
import { HeroMatchCard } from '../components/HeroMatchCard'
import { Loader } from '../components/Loader'
import { MatchCard } from '../components/MatchCard'
import { PageTitle } from '../layout/PageTitle'
import type { Match } from '../types/match'
import type { League } from '../utils/leagues'
import { trpc } from '../utils/trpc'

interface LeagueDataProps {
  league: League
}

export const LeagueData = ({ league }: LeagueDataProps) => {
  const { data: matches, isLoading: matchesLoading } =
    trpc.matches.allMatches.useQuery({
      league,
      from: dayjs().startOf('day').toDate(),
      to: dayjs().add(1, 'week').startOf('day').toDate(),
    })

  const [today, upcoming] = useMemo(() => {
    if (!matches) {
      return [[], []]
    }

    const todayMatches: Match[] = []
    const upcomingMatches: Match[] = []

    matches.forEach((match) => {
      const matchDate = dayjs(match.Date)
      if (matchDate.isSame(dayjs(), 'day')) {
        todayMatches.push(match)
      } else {
        upcomingMatches.push(match)
      }
    })

    return [todayMatches, upcomingMatches]
  }, [matches])

  const loading = matchesLoading

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="pb-12">
            <PageTitle>Today</PageTitle>
            <div className="flex snap-x gap-4 overflow-x-auto px-4 py-6">
              {today.length ? (
                today.map((match) => (
                  <HeroMatchCard
                    key={match.IdMatch}
                    league={league}
                    match={match}
                  />
                ))
              ) : (
                <div className="w-full text-center text-gray-500 lg:text-left">
                  No matches today
                </div>
              )}
            </div>
          </div>
          <div className="pb-12">
            <PageTitle>Upcoming</PageTitle>
            <div className="flex flex-col gap-4 py-6">
              {upcoming && upcoming.length ? (
                upcoming.map((match) => (
                  <MatchCard
                    key={match.IdMatch}
                    league={league}
                    match={match}
                  />
                ))
              ) : (
                <div className="w-full text-center text-gray-500 lg:text-left">
                  No matches coming up,{' '}
                  <Link
                    href={`${league}/matches?date=${dayjs()
                      .startOf('week')
                      .add(8, 'days')
                      .format('YYYY-MM-DD')}`}
                    className="text-indigo-500 hover:underline"
                  >
                    see next week
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
