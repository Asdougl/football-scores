import { z } from 'zod'
import { Localisation } from './common'

export const Stadium = z.object({
  IdStadium: z.string().nullable(),
  Name: Localisation,
  IdCity: z.string().nullable(),
  CityName: Localisation,
  IdCountry: z.string().nullable(),
})
export type Stadium = z.infer<typeof Stadium>
