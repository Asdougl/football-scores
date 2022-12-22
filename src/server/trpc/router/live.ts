import { z } from 'zod'
import { LiveMatch } from '../../../types/liveMatch'
import { Timeline } from '../../../types/timeline'
import { publicProcedure, router } from '../trpc'

export const liveRouter = router({
  liveMatch: publicProcedure
    .input(
      z.object({
        matchId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { matchId } = input

      const path = ['live', 'football', matchId].join('/')

      const response = await fetch(`https://api.fifa.com/api/v3/${path}`)

      const data = LiveMatch.nullable().parse(await response.json())

      return data
    }),
  timeline: publicProcedure
    .input(
      z.object({
        matchId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { matchId } = input

      const path = ['timelines', matchId].join('/')

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
