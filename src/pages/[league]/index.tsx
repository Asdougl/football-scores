import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farHeart } from '@fortawesome/pro-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/pro-solid-svg-icons'
import { LeagueStandings } from '../../features/league/Standings'
import { TodayMatches } from '../../features/league/TodayMatches'
import { WeekMatches } from '../../features/league/WeekMatches'
import { PageContainer, PageLayout } from '../../layout/PageLayout'
import { PageTitle } from '../../layout/PageTitle'
import type { CompetitionId } from '../../utils/leagues'
import {
  getCompetitionBySlug,
  getCompetitionData,
  getLeagueData,
  League,
} from '../../utils/leagues'
import { Knockouts } from '../../features/knockouts'
import { trpc } from '../../utils/trpc'

const LeagueView: FC<{ competitionId: CompetitionId }> = ({
  competitionId,
}) => {
  const [page, setPage] = useState<
    'matches' | 'standings' | 'knockout' | 'today'
  >('today')

  useEffect(() => {
    if (window.screen.width > 1024) {
      setPage('matches')
    }
  }, [])

  const utils = trpc.useContext()

  const { data: isFollowingLeague, isLoading: loadingFollowStatus } =
    trpc.competitionFollow.isFollowingLeague.useQuery({
      competitionId: competitionId,
    })

  const { mutate: toggleFollow, isLoading: loadingFollowLeague } =
    trpc.competitionFollow.toggleFollow.useMutation({
      onMutate: ({ status }) => {
        utils.competitionFollow.isFollowingLeague.setData(
          { competitionId: competitionId },
          status
        )
      },
    })

  const { hasKnockout, name, slug } = getCompetitionData(competitionId)

  return (
    <div>
      <div className="flex justify-between">
        <PageTitle>
          <span className="hidden lg:inline">Today</span>
          <span className="lg:hidden">{name}</span>
        </PageTitle>
        {!loadingFollowStatus && (
          <button
            className={`text-xl ${
              isFollowingLeague ? 'text-purple-500' : 'text-black'
            }`}
            onClick={() =>
              toggleFollow({
                competitionId: competitionId,
                status: !isFollowingLeague,
              })
            }
            disabled={loadingFollowLeague}
          >
            <FontAwesomeIcon icon={isFollowingLeague ? fasHeart : farHeart} />
          </button>
        )}
      </div>
      <div className="hidden lg:block">
        <TodayMatches competitionIds={[competitionId]} />
      </div>
      <ul className="flex flex-col pb-6 lg:flex-row lg:gap-4 lg:py-6">
        <li className="lg:hidden">
          <button
            className={`${
              page === 'today' ? 'text-black' : 'text-gray-300'
            } rounded text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
            onClick={() => setPage('today')}
          >
            Today
          </button>
        </li>
        <li>
          <button
            className={`${
              page === 'matches' ? 'text-black' : 'text-gray-300'
            } rounded text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
            onClick={() => setPage('matches')}
          >
            Matches
          </button>
        </li>
        {hasKnockout && (
          <li>
            <button
              className={`${
                page === 'knockout' ? 'text-black' : 'text-gray-300'
              } rounded text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
              onClick={() => setPage('knockout')}
            >
              Knockout
            </button>
          </li>
        )}
        <li>
          <button
            className={`${
              page === 'standings' ? 'text-black' : 'text-gray-300'
            } rounded text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
            onClick={() => setPage('standings')}
          >
            Standings
          </button>
        </li>
      </ul>
      {page === 'matches' && (
        <WeekMatches leagueSlug={slug} competitionIds={[competitionId]} />
      )}
      {page === 'standings' && (
        <LeagueStandings competitionId={competitionId} />
      )}
      {page === 'knockout' && <Knockouts competitionId={competitionId} />}
      {page === 'today' && <TodayMatches competitionIds={[competitionId]} />}
    </div>
  )
}

const LeaguePage: NextPage = () => {
  const router = useRouter()

  const parse = League.safeParse(router.query.league)

  let view: JSX.Element
  if (parse.success) {
    const { competitionId } = getCompetitionBySlug(parse.data)
    view = <LeagueView competitionId={competitionId} />
  } else {
    view = <div>Not found</div>
  }

  const name = parse.success ? getLeagueData(parse.data).name : 'Not found'

  return (
    <PageLayout league={parse.success ? parse.data : undefined}>
      <Head>
        <title>{`${name} | Football`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer>{view}</PageContainer>
    </PageLayout>
  )
}

export default LeaguePage
