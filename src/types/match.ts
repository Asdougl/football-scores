import { z } from 'zod'
import { Stadium } from './stadium'
import { Localisation } from './common'

export enum MatchStatus {
  FINISHED = 0,
  UPCOMING = 1,
  PENALTIES = 2,
  LIVE = 3,
  ABANDONNED = 99,
}

export const MatchTeam = z.object({
  IdTeam: z.string(),
  Score: z.number().nullable(),
  PictureUrl: z.string(),
  IdCountry: z.string(),
  Abbreviation: z.string(),
  ShortClubName: z.string(),
  TeamName: Localisation,
  Tactics: z.string().nullable(),
})
export type MatchTeam = z.infer<typeof MatchTeam>

export const PotentialMatch = z.object({
  IdMatch: z.string(),
  IdStage: z.string(),
  IdCompetition: z.string(),
  IdSeason: z.string(),
  GroupName: Localisation,
  StageName: Localisation,
  CompetitionName: Localisation,
  SeasonName: Localisation,
  Date: z.string(),
  LocalDate: z.string(),
  Home: MatchTeam.nullable(),
  HomeTeamScore: z.number().nullable(),
  HomeTeamPenaltyScore: z.number().nullable(),
  Away: MatchTeam.nullable(),
  AwayTeamScore: z.number().nullable(),
  AwayTeamPenaltyScore: z.number().nullable(),
  PlaceHolderA: z.string(),
  PlaceHolderB: z.string(),
  MatchTime: z.string().nullable(),
  MatchStatus: z.number(),
  MatchNumber: z.number().nullable(),
  MatchDay: z.string().nullable(),
  Winner: z.string().nullable(),
  Stadium: Stadium,
  ResultType: z.number(),
})
export type PotentialMatch = z.infer<typeof PotentialMatch>

export const Match = PotentialMatch.extend({
  Home: MatchTeam,
  Away: MatchTeam,
})
export type Match = z.infer<typeof Match>

export const MatchResponse = z.object({
  Results: PotentialMatch.array(),
})
