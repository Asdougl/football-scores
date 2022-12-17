import { z } from 'zod'
import isString from 'lodash/isString'
import { LiveMatch } from '../../../types/liveMatch'
import { Timeline } from '../../../types/timeline'
import { getLeagueData, League } from '../../../utils/leagues'
import { publicProcedure, router } from '../trpc'

export const liveRouter = router({
  liveMatch: publicProcedure
    .input(
      z.object({
        league: League,
        matchId: z.string(),
        stageId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { matchId, league, stageId } = input

      const leagueData = getLeagueData(league)

      const path = [
        'live',
        'football',
        leagueData.competitionId,
        leagueData.seasonId,
        stageId || isString(leagueData.stageId)
          ? leagueData.stageId
          : Object.values(leagueData.stageId)[0],
        matchId,
      ].join('/')

      const response = await fetch(`https://api.fifa.com/api/v3/${path}`)

      const data = LiveMatch.nullable().parse(await response.json())

      return data
    }),
  timeline: publicProcedure
    .input(
      z.object({
        league: League,
        matchId: z.string(),
        stageId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { matchId, league, stageId } = input

      const leagueData = getLeagueData(league)

      const path = [
        'timelines',
        leagueData.competitionId,
        leagueData.seasonId,
        stageId || isString(leagueData.stageId)
          ? leagueData.stageId
          : Object.values(leagueData.stageId)[0],
        matchId,
      ].join('/')

      const response = await fetch(`https://api.fifa.com/api/v3/${path}`)

      const data = Timeline.parse(await response.json())

      return (
        data?.Event.filter((event) => event.EventDescription.length).sort(
          (a, b) => {
            const aTimestamp = new Date(a.Timestamp)
            const bTimestamp = new Date(b.Timestamp)

            if (aTimestamp < bTimestamp) {
              return -1
            }
            if (aTimestamp > bTimestamp) {
              return 1
            }
            return 0
          }
        ) || []
      ).reverse()
    }),
})
