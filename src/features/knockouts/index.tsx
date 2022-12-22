import type { FC } from 'react'
import type { CompetitionId } from '../../utils/leagues'
import { getCompetitionData } from '../../utils/leagues'

import { WorldCup2022Knockout } from './WorldCup2022Knockout'

export const Knockouts: FC<{ competitionId: CompetitionId }> = ({
  competitionId,
}) => {
  const data = getCompetitionData(competitionId)

  if (!data.hasKnockout) return <div>This league has no knockout</div>

  if (data.slug === 'world-cup-2022') return <WorldCup2022Knockout />

  return <div>Knockout not found for this league</div>
}
