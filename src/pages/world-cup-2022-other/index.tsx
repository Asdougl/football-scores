import { faArrowLeft, faArrowRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Loader } from '../../components/Loader'
import { MatchCard } from '../../components/MatchCard'
import { Knockout } from '../../features/knockouts/WorldCup2022Knockout'
import { PageContainer, PageLayout } from '../../layout/PageLayout'
import { getLeagueData } from '../../utils/leagues'
import { pictureUrl } from '../../utils/picture'
import { trpc } from '../../utils/trpc'

const WorldCup2022Page: NextPage = () => {
  const [tab, setTab] = useState<'matches' | 'groups' | 'knockout'>('matches')

  const [matchWeek, setMatchWeek] = useState(
    dayjs().startOf('week').add(1, 'day')
  )

  const { data: matches, isLoading: matchesLoading } =
    trpc.matches.allMatches.useQuery({
      league: 'world-cup-2022',
      from: matchWeek.toDate(),
      to: matchWeek.endOf('week').add(1, 'day').toDate(),
    })
  const { data: groups, isLoading: groupsLoading } =
    trpc.standings.groupedStandings.useQuery({
      league: 'world-cup-2022',
    })

  const leagueData = getLeagueData('world-cup-2022')

  return (
    <PageLayout>
      <Head>
        <title>{`World Cup 2022 | Football`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer>
        <div className="mb-4">
          <h1 className="inline bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
            {leagueData.name}
          </h1>
        </div>
        <div className="grid grid-cols-3">
          <button onClick={() => setTab('matches')} className="py-4">
            Matches
          </button>
          <button onClick={() => setTab('groups')} className="py-4">
            Groups
          </button>
          <button onClick={() => setTab('knockout')} className="py-4">
            Knockout
          </button>
        </div>
        {/* matches tab */}
        <div
          className={`flex-col gap-4 ${tab === 'matches' ? 'flex' : 'hidden'}`}
        >
          <div className="flex">
            <button
              onClick={() => setMatchWeek((curr) => curr.subtract(1, 'week'))}
              className="group flex items-center justify-center rounded px-2 py-2 hover:bg-slate-800"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                fixedWidth
                className="translate-x-1 transition-transform group-hover:translate-x-0"
              />
            </button>
            <div className="flex-grow text-center">
              <span className="opacity-70">Week of</span>{' '}
              {dayjs(matchWeek).format('DD MMMM YYYY')}
            </div>
            <button
              onClick={() => setMatchWeek((curr) => curr.add(1, 'week'))}
              className="group flex items-center justify-center rounded px-2 py-2 hover:bg-slate-800"
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                fixedWidth
                className="-translate-x-1 transition-transform group-hover:translate-x-0"
              />
            </button>
          </div>
          {matchesLoading ? (
            <Loader />
          ) : matches && matches.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {matches.map((match) => (
                <MatchCard
                  key={match.IdMatch}
                  league={'world-cup-2022'}
                  match={match}
                />
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xl text-gray-500">
              No matches to show
            </div>
          )}
        </div>
        {/* groups tab */}
        <div
          className={classNames(
            'grid-cols-1 gap-4 lg:grid-cols-2',
            tab === 'groups' ? 'grid' : 'hidden'
          )}
        >
          {groupsLoading ? (
            <Loader />
          ) : groups && groups.length ? (
            groups.map((group) => (
              <div key={group.IdGroup}>
                <h2 className="text-lg font-bold">{group.Name}</h2>
                <table className="w-full">
                  <thead className="text-left text-sm opacity-70">
                    <tr className="border-b border-slate-700">
                      <th colSpan={3} className="pl-4">
                        Team
                      </th>
                      <th className="w-[5.5%] text-center">MP</th>
                      <th className="w-[5.5%] text-center">W</th>
                      <th className="w-[5.5%] text-center">D</th>
                      <th className="w-[5.5%] text-center">L</th>
                      <th className="w-[5.5%] text-center">GF</th>
                      <th className="w-[5.5%] text-center">GA</th>
                      <th className="w-[5.5%] text-center">GD</th>
                      <th className="w-[5.5%] text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams?.map((standing, index) => {
                      const special =
                        leagueData.positions?.[
                          (index + 1) as keyof typeof leagueData['positions']
                        ]

                      return (
                        <tr
                          key={standing.IdTeam}
                          className={classNames(
                            'h-10 border-b border-slate-700 text-lg last:border-b-0',
                            {
                              'border-l-2 border-l-blue-500':
                                special === 'success',
                              'border-l-2 border-l-red-500':
                                special === 'error',
                            }
                          )}
                        >
                          <td className="w-10 text-center">{index + 1}</td>
                          <td></td>
                          <td className="">
                            <div className="flex h-full items-center gap-1">
                              <div className="flex items-center justify-center rounded-sm">
                                <Image
                                  height={16}
                                  width={24}
                                  src={pictureUrl(standing.Team.PictureUrl, 1)}
                                  alt=""
                                  className="rounded-sm"
                                />
                              </div>
                              <div className="ml-2">
                                {standing.Team.ShortClubName}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{standing.Played}</td>
                          <td className="text-center">{standing.Won}</td>
                          <td className="text-center">{standing.Drawn}</td>
                          <td className="text-center">{standing.Lost}</td>
                          <td className="text-center">{standing.For}</td>
                          <td className="text-center">{standing.Against}</td>
                          <td className="text-center">
                            {standing.GoalsDiference}
                          </td>
                          <td className="text-center font-bold">
                            {standing.Points}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xl text-gray-500">
              No groups to show
            </div>
          )}
        </div>
        {/* knockout */}
        {tab === 'knockout' && <Knockout />}
      </PageContainer>
    </PageLayout>
  )
}

export default WorldCup2022Page
