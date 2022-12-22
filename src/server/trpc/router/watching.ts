import { z } from 'zod'
import { Match } from '../../../types/match'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const watchingRouter = router({
  getWatched: publicProcedure.query(async ({ ctx }) => {
    if (!ctx?.session?.user) {
      return null
    }

    const { user } = ctx.session

    const watched = await ctx.prisma.matchWatch.findMany({
      select: {
        matchId: true,
      },
      where: {
        userId: user.id,
      },
    })

    const matchPromises = watched.map(async (w) => {
      const response = await fetch(
        `https://api.fifa.com/api/v3/calendar/${w.matchId}`
      )

      const parse = Match.safeParse(await response.json())

      return parse.success ? parse.data : null
    })

    const matches = await Promise.all(matchPromises)

    return matches.filter((m) => m !== null) as Match[]
  }),
  isWatchingMatch: publicProcedure
    .input(
      z.object({
        matchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user) {
        return false
      }

      const { user } = ctx.session

      const match = await ctx.prisma.matchWatch.findFirst({
        where: {
          matchId: input.matchId,
          userId: user.id,
        },
      })

      return match !== null
    }),
  toggleWatchMatch: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
        status: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx?.session?.user) {
        return false
      }

      const { user } = ctx.session

      const matchWatch = await ctx.prisma.matchWatch.findFirst({
        select: {
          id: true,
        },
        where: {
          matchId: input.matchId,
          userId: user.id,
        },
      })

      if (matchWatch && !input.status) {
        await ctx.prisma.matchWatch.delete({
          where: {
            id: matchWatch.id,
          },
        })
      } else if (!matchWatch && input.status) {
        await ctx.prisma.matchWatch.create({
          data: {
            matchId: input.matchId,
            userId: user.id,
          },
        })
      }

      return input.status
    }),
})
