import dayjs from 'dayjs'
import type { FC } from 'react'
import { HeroMatchCard } from '../../components/HeroMatchCard'
import { Loader } from '../../components/Loader'
import type { CompetitionId } from '../../utils/leagues'
import { trpc } from '../../utils/trpc'

export const TodayMatches: FC<{ competitionIds: CompetitionId[] }> = ({
  competitionIds,
}) => {
  const { data: matches, isLoading: matchesLoading } =
    trpc.matches.allMatches.useQuery({
      competitionIds: competitionIds,
      from: dayjs().startOf('day').toDate(),
      to: dayjs().endOf('day').toDate(),
    })

  const loading = matchesLoading

  return loading ? (
    <Loader />
  ) : (
    <div className="pb-12">
      <div className="flex snap-x gap-4 overflow-x-auto px-4 py-6">
        {matches?.length ? (
          matches.map((match) => (
            <HeroMatchCard key={match.IdMatch} match={match} />
          ))
        ) : (
          <div className="w-full text-center text-gray-500 lg:text-left">
            No matches today
          </div>
        )}
      </div>
    </div>
  )
}
