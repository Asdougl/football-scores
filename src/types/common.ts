import { z } from 'zod'

export const Localisation = z
  .object({
    Locale: z.string(),
    Description: z.string(),
  })
  .array()
export type Localisation = z.infer<typeof Localisation>
