import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MatchData } from '../../features/MatchData'
import { PageContainer, PageLayout } from '../../layout/PageLayout'

const MatchPage: NextPage = () => {
  const router = useRouter()

  return (
    <PageLayout>
      <Head>
        <title>{`Football`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer>
        <MatchData matchId={router.query.match?.toString() || ''} />
      </PageContainer>
    </PageLayout>
  )
}

export default MatchPage
