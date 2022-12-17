import classNames from 'classnames'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { Loader } from '../../components/Loader'
import { PageContainer, PageLayout } from '../../layout/PageLayout'
import { PageTitle } from '../../layout/PageTitle'
import { getLeagueData, League } from '../../utils/leagues'
import { pictureUrl } from '../../utils/picture'
import { trpc } from '../../utils/trpc'

const StandingsView: FC<{ league: League }> = ({ league }) => {
  const leagueData = getLeagueData(league)

  const { data: standings, isLoading: standingsLoading } =
    trpc.standings.seasonStandings.useQuery({
      league,
      grouped: leagueData.hasGroup,
    })

  if (standingsLoading) return <Loader />

  return (
    <div className="grid gap-4 lg:grid-cols-2 ">
      {standings?.map((group) => (
        <div key={group.IdGroup}>
          {group.Name && (
            <h2 className="py-4 text-2xl font-bold lg:text-4xl">
              {group.Name}
            </h2>
          )}
          <table className="w-full">
            <thead className="text-left text-sm opacity-70">
              <tr className="border-b border-slate-200">
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
                const special = leagueData.positions?.[index + 1]

                return (
                  <tr
                    key={standing.IdTeam}
                    className={classNames(
                      'h-10 border-b border-slate-200 text-lg last:border-b-0',
                      {
                        'border-l-2 border-l-blue-500': special === 'success',
                        'border-l-2 border-l-orange-500': special === 'warning',
                        'border-l-2 border-l-red-500': special === 'error',
                      }
                    )}
                  >
                    <td className="text-center">{index + 1}</td>
                    <td></td>
                    <td className="">
                      <div className="flex h-full items-center gap-1">
                        <div className="flex items-center justify-center rounded-full bg-slate-300 p-[2px]">
                          <Image
                            height={16}
                            width={16}
                            src={pictureUrl(standing.Team.PictureUrl, 1)}
                            alt=""
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
                    <td className="text-center">{standing.GoalsDiference}</td>
                    <td className="text-center font-bold">{standing.Points}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

const StandingsPage: NextPage = () => {
  const router = useRouter()

  const parse = League.safeParse(router.query.league)

  const view = parse.success ? (
    <StandingsView league={parse.data} />
  ) : (
    <div>Not found</div>
  )

  const name = parse.success ? getLeagueData(parse.data).name : 'Not found'

  return (
    <PageLayout league={parse.success ? parse.data : undefined}>
      <Head>
        <title>{`${name} | Football`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer>
        <PageTitle>Standings</PageTitle>
        {view}
      </PageContainer>
    </PageLayout>
  )
}

export default StandingsPage
