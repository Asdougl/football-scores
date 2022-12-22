import { z } from 'zod'
import { Match } from '../../../../types/match'
import { Team } from '../../../../types/team'
import { protectedProcedure, publicProcedure, router } from '../../trpc'

export const teamFollowRouter = router({
  getFollowing: publicProcedure.query(async ({ ctx }) => {
    if (!ctx?.session?.user) {
      return null
    }

    const { user } = ctx.session

    const following = await ctx.prisma.teamFollow.findMany({
      select: {
        teamId: true,
      },
      where: {
        userId: user.id,
      },
    })

    const teamPromises = following.map(async (f) => {
      const response = await fetch(
        `https://api.fifa.com/api/v3/teams/${f.teamId}`
      )

      const parse = Team.safeParse(await response.json())

      return parse.success ? parse.data : null
    })

    const teams = await Promise.all(teamPromises)

    return teams.filter((t) => t !== null) as Team[]
  }),
  getFollowingIds: publicProcedure.query(async ({ ctx }) => {
    if (!ctx?.session?.user) {
      return []
    }
    const { user } = ctx.session

    const following = await ctx.prisma.teamFollow.findMany({
      select: {
        teamId: true,
      },
      where: {
        userId: user.id,
      },
    })

    return following.map((f) => f.teamId)
  }),
  isFollowingTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user) {
        return false
      }

      const { user } = ctx.session

      const following = await ctx.prisma.teamFollow.findFirst({
        select: {
          teamId: true,
        },
        where: {
          teamId: input.teamId,
          userId: user.id,
        },
      })

      return !!following
    }),
  isFollowingTeams: publicProcedure
    .input(
      z.object({
        matchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user) {
        return {
          home: false,
          away: false,
        }
      }

      const { user } = ctx.session

      const response = await fetch(
        `https://api.fifa.com/api/v3/calendar/${input.matchId}`
      )

      const matchParse = Match.safeParse(await response.json())

      if (!matchParse.success) {
        return {
          home: false,
          away: false,
        }
      }
      const following = await ctx.prisma.teamFollow.findMany({
        select: {
          teamId: true,
        },
        where: {
          teamId: {
            in: [matchParse.data.Home.IdTeam, matchParse.data.Away.IdTeam],
          },
          userId: user.id,
        },
      })

      return {
        home: following.some((f) => f.teamId === matchParse.data.Home.IdTeam),
        away: following.some((f) => f.teamId === matchParse.data.Away.IdTeam),
      }
    }),
  toggleFollow: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        status: z.boolean(),
        home: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session

      const following = await ctx.prisma.teamFollow.findFirst({
        select: {
          id: true,
          teamId: true,
        },
        where: {
          teamId: input.teamId,
          userId: user.id,
        },
      })

      if (following && !input.status) {
        await ctx.prisma.teamFollow.delete({
          where: {
            id: following.id,
          },
        })
      } else if (!following && input.status) {
        await ctx.prisma.teamFollow.create({
          data: {
            teamId: input.teamId,
            userId: user.id,
          },
        })
      }

      return input.status
    }),
})
