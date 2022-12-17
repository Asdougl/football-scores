import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MatchData } from '../../features/MatchData'
import { PageContainer, PageLayout } from '../../layout/PageLayout'
import { getLeagueData, League } from '../../utils/leagues'

const MatchPage: NextPage = () => {
  const router = useRouter()

  const parse = League.safeParse(router.query.league)

  let name: string, view: JSX.Element
  if (parse.success) {
    const leagueData = getLeagueData(parse.data)
    name = leagueData.name
    view = (
      <MatchData
        league={parse.data}
        matchId={router.query.match?.toString() || ''}
        international={leagueData.international}
      />
    )
  } else {
    name = 'Not found'
    view = <div>Not found</div>
  }

  return (
    <PageLayout league={parse.success ? parse.data : undefined}>
      <Head>
        <title>{`${name} | Football`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer>{view}</PageContainer>
    </PageLayout>
  )
}

export default MatchPage
