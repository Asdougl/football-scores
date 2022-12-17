import type { MatchTeam } from '../types/match'

type OutcomeTeam = Pick<
  MatchTeam,
  'IdTeam' | 'Score' | 'ShortClubName' | 'Abbreviation'
>

export const outcome = (
  winner: string | null,
  home: OutcomeTeam,
  away: OutcomeTeam,
  abbreviation?: boolean
) => {
  if (home.Score === null || away.Score === null) {
    return 'Not played'
  }

  if (winner === home.IdTeam) {
    return `${abbreviation ? home.Abbreviation : home.ShortClubName} won`
  } else if (winner === away.IdTeam) {
    return `${abbreviation ? away.Abbreviation : away.ShortClubName} won`
  } else {
    return 'Draw'
  }
}
