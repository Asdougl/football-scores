import { z } from 'zod'

export const PositionType = z.enum(['success', 'warning', 'error'])
export type PositionType = z.infer<typeof PositionType>

type LeagueData = {
  name: string
  competitionId: string
  seasonId: string
  stageId: string | Record<string, string>
  positions?: Record<number, PositionType>
  hasKnockout?: boolean
  hasGroup?: boolean
  international?: boolean
}

export const League = z.enum(['premier-league', 'a-league', 'world-cup-2022'])
export type League = z.infer<typeof League>

const leagueMap: Record<League, LeagueData> = {
  'premier-league': {
    name: 'Premier League',
    competitionId: '2000000000',
    seasonId: '80foo89mm28qjvyhjzlpwj28k',
    stageId: '80qbeanalyj5cvxikkq351iqc',
    positions: {
      1: 'success',
      2: 'success',
      3: 'success',
      4: 'success',
      5: 'warning',
      18: 'error',
      19: 'error',
      20: 'error',
    },
  },
  'a-league': {
    name: 'A-League',
    competitionId: '2000000086',
    seasonId: '300ig4lfofmkh3u971h34pbf8',
    stageId: '30dogamt1hec4h1l75qupxnh0',
  },
  'world-cup-2022': {
    name: 'World Cup 2022',
    competitionId: '17',
    seasonId: '255711',
    stageId: {
      group: '285063',
      round16: '285073',
      quarter: '285074',
      semi: '285075',
      final: '285077',
      third: '285076',
    },
    positions: {
      1: 'success',
      2: 'success',
      3: 'error',
      4: 'error',
    },
    hasKnockout: true,
    hasGroup: true,
    international: true,
  },
}

export const getLeagueData = <Key extends League>(
  league: Key
): typeof leagueMap[Key] => leagueMap[league]

export const getLeagueById = (id: string) => {
  const league = League.options.find(
    (key) => leagueMap[key].competitionId === id
  )
  return league
}
