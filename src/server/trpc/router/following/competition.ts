import { z } from 'zod'
import { CompetitionId } from '../../../../utils/leagues'
import { protectedProcedure, publicProcedure, router } from '../../trpc'

export const competitionFollowRouter = router({
  getFollowing: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) return []

    const { user } = ctx.session

    const following = await ctx.prisma.leagueFollow.findMany({
      select: {
        competitionId: true,
      },
      where: {
        userId: user.id,
      },
    })

    const competitionIds: CompetitionId[] = []
    following.forEach((f) => {
      const parse = CompetitionId.safeParse(f.competitionId)
      if (parse.success) {
        competitionIds.push(parse.data)
      }
    })

    return competitionIds
  }),
  isFollowingLeague: publicProcedure
    .input(
      z.object({
        competitionId: CompetitionId,
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) return false

      const { user } = ctx.session

      const following = await ctx.prisma.leagueFollow.findFirst({
        select: {
          competitionId: true,
        },
        where: {
          competitionId: input.competitionId,
          userId: user.id,
        },
      })

      return !!following
    }),
  toggleFollow: protectedProcedure
    .input(
      z.object({
        competitionId: CompetitionId,
        status: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session

      const following = await ctx.prisma.leagueFollow.findFirst({
        select: {
          id: true,
          competitionId: true,
        },
        where: {
          competitionId: input.competitionId,
          userId: user.id,
        },
      })

      if (input.status && !following) {
        await ctx.prisma.leagueFollow.create({
          data: {
            competitionId: input.competitionId,
            userId: user.id,
          },
        })
      } else if (!input.status && following) {
        await ctx.prisma.leagueFollow.delete({
          where: {
            id: following.id,
          },
        })
      }

      return true
    }),
})
