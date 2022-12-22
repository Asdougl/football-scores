import { z } from 'zod'

export const PositionType = z.enum(['success', 'warning', 'error'])
export type PositionType = z.infer<typeof PositionType>

export const League = z.enum([
  'premier-league',
  'a-league',
  'world-cup-2022',
  'la-liga',
  'bundesliga',
  'scottish-premiership',
  'ligue-1',
])
export type League = z.infer<typeof League>

export const CompetitionId = z.enum([
  '2000000000',
  '2000000086',
  '17',
  '2000000037',
  '2000000019',
  '2000000001',
  '2000000018',
])
export type CompetitionId = z.infer<typeof CompetitionId>

type CompetitionData = {
  name: string
  slug: League
  competitionId: CompetitionId
  seasonId: string
  stageId: string | Record<string, string>
  positions?: Record<number, PositionType>
  hasKnockout?: boolean
  hasGroup?: boolean
  international?: boolean
}

const leagueMap: Record<League, CompetitionData> = {
  'premier-league': {
    name: 'Premier League',
    slug: 'premier-league',
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
    slug: 'a-league',
    competitionId: '2000000086',
    seasonId: '300ig4lfofmkh3u971h34pbf8',
    stageId: '30dogamt1hec4h1l75qupxnh0',
  },
  'la-liga': {
    name: 'La Liga',
    slug: 'la-liga',
    competitionId: '2000000037',
    seasonId: 'e4idaotcivcpu4rqyvrwbciz8',
    stageId: 'e4psenjkwzep8is4ia9jmgftg',
  },
  bundesliga: {
    name: 'Bundesliga',
    slug: 'bundesliga',
    competitionId: '2000000019',
    seasonId: 'eg8fn8zof4ps7z12vlxa6efx0',
    stageId: 'egi94n9ib3cq1ejjwp52nrcb8',
  },
  'scottish-premiership': {
    name: 'Scottish Premiership',
    slug: 'scottish-premiership',
    competitionId: '2000000001',
    seasonId: '4vn5ws6lkmjrn2364kcx722vo',
    stageId: '4vvsuiovkpniwkezxi6hjjqxg',
  },
  'ligue-1': {
    name: 'Ligue 1',
    slug: 'ligue-1',
    competitionId: '2000000018',
    seasonId: 'b5rz3ukb6kvo9m5neiptb0avo',
    stageId: 'b5zf77j90y6pj6j4xdkgjz7ys',
  },
  'world-cup-2022': {
    name: 'World Cup 2022',
    slug: 'world-cup-2022',
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

const competitionMap: Record<CompetitionId, CompetitionData> = {
  '2000000000': leagueMap['premier-league'],
  '2000000086': leagueMap['a-league'],
  '17': leagueMap['world-cup-2022'],
  '2000000037': leagueMap['la-liga'],
  '2000000019': leagueMap['bundesliga'],
  '2000000001': leagueMap['scottish-premiership'],
  '2000000018': leagueMap['ligue-1'],
}

export const getCompetitionData = (id: CompetitionId) => competitionMap[id]

export const getCompetitionBySlug = (slug: League) => leagueMap[slug]

export const getLeagueData = <Key extends League>(
  league: Key
): typeof leagueMap[Key] => leagueMap[league]

export const getLeagueById = (id: string) => {
  const league = League.options.find(
    (key) => leagueMap[key].competitionId === id
  )
  return league
}

export const isInternational = (id: string | undefined) => {
  if (!id) return false
  const league = getLeagueById(id)
  return league ? leagueMap[league].international : false
}
