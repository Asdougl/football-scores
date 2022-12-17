import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { LeagueData } from '../../features/LeagueData'
import { PageContainer, PageLayout } from '../../layout/PageLayout'
import { getLeagueData, League } from '../../utils/leagues'

const LeaguePage: NextPage = () => {
  const router = useRouter()

  const parse = League.safeParse(router.query.league)

  const view = parse.success ? (
    <LeagueData league={parse.data} />
  ) : (
    <div>Not found</div>
  )

  const name = parse.success ? getLeagueData(parse.data).name : 'Not found'

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

export default LeaguePage
