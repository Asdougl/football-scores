import { z } from 'zod'
import { TeamForm } from '../../../types/teamform'
import { publicProcedure, router } from '../trpc'

export const teamRouter = router({
  performance: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        to: z.string(),
        count: z.number(),
      })
    )
    .query(async ({ input }) => {
      const params = new URLSearchParams({
        to: input.to,
        count: input.count.toString(),
      })

      const path = ['teamform', input.teamId].join('/')
      const response = await fetch(
        `https://api.fifa.com/api/v3/${path}?${params.toString()}`
      )
      const data = TeamForm.parse(await response.json())
      return data
    }),
})
