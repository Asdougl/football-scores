import { z } from 'zod'
import { Localisation } from './common'
import { Match } from './match'

export const TeamForm = z.object({
  IdTeam: z.string(),
  TeamName: Localisation,
  IdCountry: z.string(),
  ShortClubName: z.string(),
  Abbreviation: z.string(),
  PictureUrl: z.string(),
  MatchesPlayed: z.number(),
  Wins: z.number(),
  Losses: z.number(),
  Draws: z.number(),
  GoalsScored: z.number(),
  GoalsAgainst: z.number(),
  MatchesList: Match.array(),
})
export type TeamForm = z.infer<typeof TeamForm>
