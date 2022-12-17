import { router } from '../trpc'
import { liveRouter } from './live'
import { matchesRouter } from './matches'
import { standingsRouter } from './stadings'

export const appRouter = router({
  matches: matchesRouter,
  standings: standingsRouter,
  live: liveRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
