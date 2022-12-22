import { z } from 'zod'
import { Localisation } from './common'

export const Team = z.object({
  IdTeam: z.string(),
  IdConfederation: z.string(),
  Type: z.number(),
  AgeType: z.number(),
  FootballType: z.number(),
  Gender: z.number(),
  Name: Localisation,
  IdAssociation: z.string(),
  City: z.string(),
  IdCountry: z.string(),
  PostalCode: z.string(),
  ShortClubName: z.string(),
  Abbreviation: z.string(),
  Street: z.string(),
  FoundationYear: z.number().nullable(),
  PictureUrl: z.string(),
  DisplayName: Localisation,
  Properties: z
    .object({
      IdIFES: z.string().optional(),
      StatsPerformIfesId: z.string().optional(),
      IdStatsPerform: z.string(),
    })
    .nullable(),
})
export type Team = z.infer<typeof Team>
