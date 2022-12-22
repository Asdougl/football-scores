import { faHeart as fasHeart } from '@fortawesome/pro-solid-svg-icons'
import { faHeart as farHeart } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import type { FC } from 'react'
import { ClubCrest } from '../../components/ClubCrest'
import { Loader } from '../../components/Loader'
import type { CompetitionId } from '../../utils/leagues'
import { getCompetitionData } from '../../utils/leagues'

import { pictureUrl } from '../../utils/picture'
import { trpc } from '../../utils/trpc'

export const LeagueStandings: FC<{ competitionId: CompetitionId }> = ({
  competitionId,
}) => {
  const leagueData = getCompetitionData(competitionId)

  const utils = trpc.useContext()

  const { data: standings, isLoading: standingsLoading } =
    trpc.standings.seasonStandings.useQuery({
      competitionId,
      grouped: leagueData.hasGroup,
    })

  const { data: teamFollows } = trpc.teamFollow.getFollowingIds.useQuery()

  const { mutate: toggleFollow, isLoading: loadingFollowTeam } =
    trpc.teamFollow.toggleFollow.useMutation({
      onMutate: ({ status, teamId }) => {
        utils.teamFollow.getFollowingIds.setData(undefined, (prev) => {
          if (!prev) return status ? [teamId] : []
          if (status) {
            return [...prev, teamId]
          }
          return prev.filter((id) => id !== teamId)
        })
      },
    })

  if (standingsLoading) return <Loader />

  return (
    <div
      className={classNames('grid gap-4', {
        'lg:grid-cols-2': leagueData.hasGroup,
      })}
    >
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
                const isFollowing = teamFollows?.includes(standing.IdTeam)

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
                      <button
                        className="group flex h-full items-center gap-1"
                        onClick={() =>
                          toggleFollow({
                            teamId: standing.IdTeam,
                            status: !isFollowing,
                          })
                        }
                        disabled={loadingFollowTeam}
                      >
                        <ClubCrest
                          imgUrl={pictureUrl(standing.Team.PictureUrl, 4)}
                          size="xs"
                        />
                        <div className="ml-2">
                          {standing.Team.ShortClubName}
                        </div>
                        <div
                          className={classNames(
                            'flex items-center justify-center pl-1 text-sm transition-all group-hover:translate-y-0 group-hover:opacity-100',
                            { 'translate-y-2 opacity-0': !isFollowing }
                          )}
                        >
                          <FontAwesomeIcon
                            icon={isFollowing ? fasHeart : farHeart}
                          />
                        </div>
                      </button>
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
