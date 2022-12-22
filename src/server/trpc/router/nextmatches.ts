import { z } from 'zod'
import { Match, MatchResponse, PotentialMatch } from '../../../types/match'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const nextmatchesRouter = router({
  getMatches: publicProcedure
    .input(
      z.object({
        teamIds: z.string().array(),
        count: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const { teamIds, count } = input

      const path = ['calendar', 'nextmatches'].join('/')

      const matchpromises = teamIds.map(async (teamId) => {
        const params = new URLSearchParams({
          idTeam: teamId,
          numberOfNextMatches: count?.toString() || '2',
          numberOfPreviousMatches: '0',
        })

        const response = await fetch(
          `https://api.fifa.com/api/v3/${path}?${params.toString()}`
        )

        const data = MatchResponse.safeParse(await response.json())

        return data.success ? data.data.Results : []
      })

      const allTeamMatches = await Promise.all(matchpromises)

      const matches: Match[] = []

      allTeamMatches.forEach((team) => {
        team.forEach((match) => {
          const parse = Match.safeParse(match)
          if (parse.success) {
            matches.push(parse.data)
          }
        })
      })

      return teamIds.length > 1
        ? matches.sort((a, b) => {
            const aDate = new Date(a.Date)
            const bDate = new Date(b.Date)

            if (aDate < bDate) {
              return -1
            }
            if (aDate > bDate) {
              return 1
            }
            return 0
          })
        : matches
    }),
  getWatchedMatches: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user

    const teamsFollowedPromise = ctx.prisma.teamFollow.findMany({
      where: {
        userId: id,
      },
    })

    const matchesWatchedPromise = ctx.prisma.matchWatch.findMany({
      where: {
        userId: id,
      },
    })

    const [teamsFollowed, matchesWatched] = await Promise.all([
      teamsFollowedPromise,
      matchesWatchedPromise,
    ])

    const nextTeamMatchesPromises = teamsFollowed.map(async (team) => {
      const path = ['calendar', 'nextmatches'].join('/')
      const params = new URLSearchParams({
        idTeam: team.teamId,
        numberOfNextMatches: '1',
        numberOfPreviousMatches: '0',
      })

      const response = await fetch(
        `https://api.fifa.com/api/v3/${path}?${params.toString()}`
      )

      const data = MatchResponse.safeParse(await response.json())

      return data.success ? data.data.Results[0] : undefined
    })

    const watchedMatchesPromises = matchesWatched.map(async (match) => {
      const response = await fetch(
        `https://api.fifa.com/api/v3/calendar/${match.matchId}`
      )

      const parse = PotentialMatch.safeParse(await response.json())

      return parse.success ? parse.data : undefined
    })

    const [nextMatches, watchedMatches] = await Promise.all([
      Promise.all(nextTeamMatchesPromises),
      Promise.all(watchedMatchesPromises),
    ])

    const matches = [...nextMatches, ...watchedMatches].filter(
      (match): match is Match => match !== undefined
    )

    return matches.sort((a, b) => {
      const aDate = new Date(a.Date)
      const bDate = new Date(b.Date)

      if (aDate < bDate) {
        return -1
      }
      if (aDate > bDate) {
        return 1
      }
      return 0
    })
  }),
})
