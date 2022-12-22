import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import type { FC } from 'react'
import { useState } from 'react'
import { HeroMatchCard } from '../components/HeroMatchCard'
import { MatchCard } from '../components/MatchCard'
import { PageContainer, PageLayout } from '../layout/PageLayout'
import { PageTitle } from '../layout/PageTitle'
import type { Team } from '../types/team'
import { trpc } from '../utils/trpc'

const ScoresView: FC<{
  teams: Team[]
}> = ({ teams }) => {
  const [active, setActive] = useState(teams[0])

  const { data: teamMatches } = trpc.nextmatches.getWatchedMatches.useQuery()

  const { data: activeTeamMatches } = trpc.nextmatches.getMatches.useQuery(
    {
      teamIds: [active?.IdTeam || ''],
      count: 5,
    },
    { enabled: !!active }
  )

  return (
    <div>
      <PageTitle>Watchlist</PageTitle>
      <div className="flex snap-x gap-4 overflow-auto py-4 px-2">
        {teamMatches?.map((match) => (
          <div key={match.IdMatch}>
            <HeroMatchCard match={match} />
          </div>
        ))}
      </div>
      <ul className="flex flex-col gap-2 py-8 lg:flex-row">
        {teams.map((team) => (
          <li key={team.IdTeam} className="">
            <button
              className={`${
                active?.IdTeam === team.IdTeam ? 'text-black' : 'text-gray-300'
              } rounded px-4 text-4xl font-bold ring-indigo-500 focus:outline-none focus:ring`}
              onClick={() => setActive(team)}
            >
              {team.Name[0]?.Description || team.ShortClubName}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-4">
        {activeTeamMatches?.map((match) => (
          <div key={match.IdMatch}>
            <MatchCard match={match} />
          </div>
        ))}
      </div>
    </div>
  )
}

const ScoresWrapper: FC = () => {
  const { data: teams } = trpc.teamFollow.getFollowing.useQuery()

  return !teams ? (
    <div>Follow teams and Competitions</div>
  ) : (
    <ScoresView teams={teams} />
  )
}

const ScoresPage: NextPage = () => {
  const { data: session } = useSession()

  return (
    <PageLayout>
      <Head>
        <title>{`My Scores | Football`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer>
        {session?.user ? <ScoresWrapper /> : <div>Not logged in</div>}
      </PageContainer>
    </PageLayout>
  )
}

export default ScoresPage
