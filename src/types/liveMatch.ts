import { z } from 'zod'
import { Localisation } from './common'
import { Stadium } from './stadium'

export const MatchPeriod = {
  PRE_MATCH: 2,
  FIRST_HALF: 3,
  HALF_TIME: 4,
  SECOND_HALF: 5,
  FULL_TIME: 10,
} as const

export const PlayerPosition = {
  GOALKEEPER: 0,
  DEFENDER: 1,
  MIDFIELDER: 2,
  FORWARD: 3,
} as const

export const LiveMatchCoach = z.object({
  IdCoach: z.string(),
  IdCountry: z.string(),
  PictureUrl: z.string().nullable(),
  Name: Localisation,
  Alias: Localisation,
  Role: z.number(),
})
export type LiveMatchCoach = z.infer<typeof LiveMatchCoach>

export const LiveMatchTeamPlayer = z.object({
  IdPlayer: z.string(),
  IdTeam: z.string(),
  ShirtNumber: z.number(),
  Status: z.number(),
  Captain: z.boolean().nullable(),
  SpecialStatus: z.number().nullable(),
  PlayerName: Localisation,
  ShortName: Localisation,
  Position: z.number(),
  PlayerPicture: z
    .object({
      Id: z.string(),
      PictureUrl: z.string(),
    })
    .nullable(),
  FieldStatus: z.number(),
  LineupX: z.number().nullable(),
  LineupY: z.number().nullable(),
})
export type LiveMatchTeamPlayer = z.infer<typeof LiveMatchTeamPlayer>

export const LiveMatchTeam = z.object({
  IdTeam: z.string(),
  Score: z.number().nullable(),
  PictureUrl: z.string(),
  IdCountry: z.string(),
  Abbreviation: z.string(),
  ShortClubName: z.string(),
  Tactics: z.string().nullable(),
  Coaches: LiveMatchCoach.array(),
  Players: LiveMatchTeamPlayer.array(),
  TeamName: Localisation,
})
export type LiveMatchTeam = z.infer<typeof LiveMatchTeam>

export const LiveMatch = z.object({
  IdMatch: z.string(),
  IdStage: z.string(),
  IdGroup: z.string().nullable(),
  IdSeason: z.string(),
  IdCompetition: z.string(),
  CompetitionName: Localisation,
  SeasonName: Localisation,
  Stadium: Stadium,
  ResultType: z.number(),
  MatchDay: z.string(),
  Attendance: z.string().nullable(),
  Date: z.string(),
  LocalDate: z.string(),
  MatchStatus: z.number(),
  MatchTime: z.string(),
  Winner: z.string().nullable(),
  Period: z.number(),
  HomeTeam: LiveMatchTeam,
  AwayTeam: LiveMatchTeam,
  HomeTeamPenaltyScore: z.number().nullable(),
  AwayTeamPenaltyScore: z.number().nullable(),
  BallPossession: z
    .object({
      OverallHome: z.number().nullable(),
      OverallAway: z.number().nullable(),
    })
    .nullable(),
})
export type LiveMatch = z.infer<typeof LiveMatch>
