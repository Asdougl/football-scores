import isString from 'lodash/isString'
import { z } from 'zod'
import type { Group } from '../../../types/group'
import { StandingsResponse } from '../../../types/standing'
import { League, getLeagueData } from '../../../utils/leagues'
import { publicProcedure, router } from '../trpc'

export const standingsRouter = router({
  seasonStandings: publicProcedure
    .input(
      z.object({
        league: League,
        stageId: z.string().optional(),
        grouped: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const league = getLeagueData(input.league)

      const path = [
        'calendar',
        league.competitionId,
        league.seasonId,
        input.stageId || isString(league.stageId)
          ? league.stageId
          : Object.values(league.stageId)[0],
        'Standing',
      ].join('/')

      const response = await fetch(`https://api.fifa.com/api/v3/${path}`)

      const data = StandingsResponse.parse(await response.json())

      if (input.grouped) {
        const groupsMap: Record<string, Group> = {}

        data.Results.forEach((standing) => {
          const { IdGroup, Group } = standing

          if (IdGroup) {
            if (!groupsMap[IdGroup]) {
              groupsMap[IdGroup] = {
                IdGroup,
                Name: Group[0]?.Description || '',
                teams: [standing],
              }
            } else {
              groupsMap[IdGroup]?.teams.push(standing)
            }
          }
        })

        return Object.values(groupsMap)
      }

      return [
        {
          IdGroup: '-1',
          Name: '',
          teams: data.Results,
        },
      ]
    }),
  groupedStandings: publicProcedure
    .input(
      z.object({
        league: League,
        stageId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const league = getLeagueData(input.league)

      const path = [
        'calendar',
        league.competitionId,
        league.seasonId,
        input.stageId || isString(league.stageId)
          ? league.stageId
          : Object.values(league.stageId)[0],
        'Standing',
      ].join('/')

      const response = await fetch(`https://api.fifa.com/api/v3/${path}`)

      const data = StandingsResponse.parse(await response.json())

      const groupsMap: Record<string, Group> = {}

      data.Results.forEach((standing) => {
        const { IdGroup, Group } = standing

        if (IdGroup) {
          if (!groupsMap[IdGroup]) {
            groupsMap[IdGroup] = {
              IdGroup,
              Name: Group[0]?.Description || '',
              teams: [standing],
            }
          } else {
            groupsMap[IdGroup]?.teams.push(standing)
          }
        }
      })

      return Object.values(groupsMap)
    }),
})
