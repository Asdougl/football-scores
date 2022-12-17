import isString from 'lodash/isString'
import { KnockoutMatch } from '../../components/KnockoutMatch'
import { Loader } from '../../components/Loader'
import { getLeagueData } from '../../utils/leagues'
import { trpc } from '../../utils/trpc'

const worldCup = getLeagueData('world-cup-2022')

export const WorldCup2022Knockout = () => {
  const { data: r16Matches, isLoading: round16Loading } =
    trpc.matches.knockoutMatches.useQuery({
      league: 'world-cup-2022',
      stageId: (!isString(worldCup.stageId) && worldCup.stageId.round16) || '',
    })
  const { data: quarterMatches, isLoading: quarterLoading } =
    trpc.matches.knockoutMatches.useQuery({
      league: 'world-cup-2022',
      stageId: (!isString(worldCup.stageId) && worldCup.stageId.quarter) || '',
    })
  const { data: semiMatches, isLoading: semiLoading } =
    trpc.matches.knockoutMatches.useQuery({
      league: 'world-cup-2022',
      stageId: (!isString(worldCup.stageId) && worldCup.stageId.semi) || '',
    })
  const { data: finalMatches, isLoading: finalLoading } =
    trpc.matches.knockoutMatches.useQuery({
      league: 'world-cup-2022',
      stageId: (!isString(worldCup.stageId) && worldCup.stageId.final) || '',
    })
  const { data: thirdMatches, isLoading: thirdLoading } =
    trpc.matches.knockoutMatches.useQuery({
      league: 'world-cup-2022',
      stageId: (!isString(worldCup.stageId) && worldCup.stageId.third) || '',
    })

  const loading =
    round16Loading ||
    quarterLoading ||
    semiLoading ||
    finalLoading ||
    thirdLoading

  if (loading) return <Loader />

  return (
    <div className="overflow-x-auto px-4 pt-8 pb-12 lg:px-0">
      <div className="flex gap-16">
        <div className="flex flex-grow flex-col justify-center pt-10">
          <div className="relative flex flex-col gap-4">
            <h2 className="absolute bottom-full left-0 px-2 py-2 text-4xl font-bold">
              Round of 16
            </h2>
            {r16Matches && (
              <>
                {r16Matches['49'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['49']}
                    arrowOffset={1}
                    winnerTo="57-home"
                  />
                )}
                {r16Matches['50'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['50']}
                    arrowOffset={0}
                    winnerTo="57-away"
                  />
                )}
                {r16Matches['53'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['53']}
                    arrowOffset={-1}
                    winnerTo="58-home"
                  />
                )}
                {r16Matches['54'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['54']}
                    arrowOffset={-2}
                    winnerTo="58-away"
                  />
                )}
                {r16Matches['51'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['51']}
                    arrowOffset={-2}
                    winnerTo="59-home"
                  />
                )}
                {r16Matches['52'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['52']}
                    arrowOffset={-1}
                    winnerTo="59-away"
                  />
                )}
                {r16Matches['55'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['55']}
                    arrowOffset={0}
                    winnerTo="60-home"
                  />
                )}
                {r16Matches['56'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={r16Matches['56']}
                    arrowOffset={1}
                    winnerTo="60-away"
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-grow flex-col justify-center gap-4 pt-10">
          <div className="relative flex flex-col gap-4">
            <h2 className="absolute bottom-full left-0 px-2 py-2 text-4xl font-bold">
              Quarter Finals
            </h2>
            {quarterMatches && (
              <>
                {quarterMatches['57'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={quarterMatches['57']}
                    arrowOffset={1}
                    winnerTo="61-home"
                    progress={2 / 3}
                  />
                )}
                {quarterMatches['58'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={quarterMatches['58']}
                    arrowOffset={1}
                    winnerTo="61-away"
                    progress={2 / 3}
                  />
                )}
                {quarterMatches['59'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={quarterMatches['59']}
                    arrowOffset={1}
                    winnerTo="62-home"
                    progress={2 / 3}
                  />
                )}
                {quarterMatches['60'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={quarterMatches['60']}
                    arrowOffset={1}
                    winnerTo="62-away"
                    progress={2 / 3}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-grow flex-col justify-center gap-4 pt-10">
          <div className="relative flex flex-col gap-4">
            <h2 className="absolute bottom-full left-0 px-2 py-2 text-4xl font-bold">
              Semi Finals
            </h2>
            {semiMatches && (
              <>
                {semiMatches['61'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={semiMatches['61']}
                    arrowOffset={-1}
                    winnerTo="64-home"
                    progress={3 / 3}
                  />
                )}
                {semiMatches['62'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={semiMatches['62']}
                    arrowOffset={1}
                    winnerTo="64-away"
                    progress={3 / 3}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-grow flex-col justify-center gap-4 pt-10">
          <div className="relative flex flex-col gap-4">
            <h2 className="absolute bottom-full left-0 px-2 py-2 text-4xl font-bold">
              Final
            </h2>
            {finalMatches && (
              <>
                {finalMatches['64'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={finalMatches['64']}
                    arrowOffset={1}
                  />
                )}
              </>
            )}
          </div>
          <div className="relative flex flex-col gap-2">
            <h2 className="bottom-full left-0 px-2 pt-6 text-4xl font-bold">
              Third Place
            </h2>
            {thirdMatches && (
              <>
                {thirdMatches['63'] && (
                  <KnockoutMatch
                    league="world-cup-2022"
                    match={thirdMatches['63']}
                    arrowOffset={1}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
