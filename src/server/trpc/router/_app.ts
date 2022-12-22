import { router } from '../trpc'
import { competitionFollowRouter } from './following/competition'
import { teamFollowRouter } from './following/team'
import { liveRouter } from './live'
import { matchesRouter } from './matches'
import { nextmatchesRouter } from './nextmatches'
import { standingsRouter } from './stadings'
import { watchingRouter } from './watching'

export const appRouter = router({
  matches: matchesRouter,
  standings: standingsRouter,
  live: liveRouter,
  competitionFollow: competitionFollowRouter,
  teamFollow: teamFollowRouter,
  nextmatches: nextmatchesRouter,
  watching: watchingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
