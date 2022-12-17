import dayjs from 'dayjs'
import { z } from 'zod'
import { Match, MatchResponse, PotentialMatch } from '../../../types/match'
import { League, getLeagueData } from '../../../utils/leagues'
import { publicProcedure, router } from '../trpc'

export const matchesRouter = router({
  allMatches: publicProcedure
    .input(
      z.object({
        league: League,
        from: z.date().optional(),
        to: z.date().optional(),
        stageId: z.string().optional(),
        groupId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { league, from, to, stageId, groupId } = input

      const leagueData = getLeagueData(league)

      const params = new URLSearchParams({
        idSeason: leagueData.seasonId,
        count: '500',
        from: (from ? dayjs(from) : dayjs(from).startOf('week').add(1, 'day'))
          .startOf('day')
          .format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
        to: (to ? dayjs(to) : dayjs(to).endOf('week').add(1, 'day'))
          .endOf('day')
          .format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      })

      if (stageId) params.set('idStage', stageId)
      if (groupId) params.set('idGroup', groupId)

      const response = await fetch(
        `https://api.fifa.com/api/v3/calendar/matches?${params.toString()}`
      )

      const data = MatchResponse.parse(await response.json())

      const matches: Match[] = []

      data.Results.forEach((match) => {
        const parse = Match.safeParse(match)
        if (parse.success) {
          matches.push(parse.data)
        }
      })

      return matches
    }),
  oneMatch: publicProcedure
    .input(
      z.object({
        matchId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { matchId } = input

      const response = await fetch(
        `https://api.fifa.com/api/v3/calendar/${matchId}`
      )

      return PotentialMatch.parse(await response.json())
    }),
  knockoutMatches: publicProcedure
    .input(
      z.object({
        league: League,
        stageId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { league, stageId } = input

      const leagueData = getLeagueData(league)

      const params = new URLSearchParams({
        idSeason: leagueData.seasonId,
        count: '500',
        idStage: stageId,
      })

      const response = await fetch(
        `https://api.fifa.com/api/v3/calendar/matches?${params.toString()}`
      )

      const data = MatchResponse.parse(await response.json())

      const map: Record<string, PotentialMatch> = {}

      data.Results.forEach((match) => {
        if (match.MatchNumber) {
          map[match.MatchNumber] = match
        }
      })

      return map
    }),
})
