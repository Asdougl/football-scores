import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { WorldCup2022Knockout } from '../../features/knockouts/WorldCup2022Knockout'
import { PageContainer, PageLayout } from '../../layout/PageLayout'
import { PageTitle } from '../../layout/PageTitle'
import { getLeagueData, League } from '../../utils/leagues'

const KnockoutView: FC<{ league: League }> = ({ league }) => {
  const data = getLeagueData(league)

  if (!data.hasKnockout) return <div>This league has no knockout</div>

  if (league === 'world-cup-2022') return <WorldCup2022Knockout />

  return <div>Not found</div>
}

const KnockoutPage: NextPage = () => {
  const router = useRouter()

  const parse = League.safeParse(router.query.league)

  const view = parse.success ? (
    <KnockoutView league={parse.data} />
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
      <PageContainer>
        <PageTitle>Knockout</PageTitle>
        {view}
      </PageContainer>
    </PageLayout>
  )
}

export default KnockoutPage
