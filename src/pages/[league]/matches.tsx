import { faArrowLeft, faArrowRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import isString from 'lodash/isString'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { Loader } from '../../components/Loader'
import { MatchCard } from '../../components/MatchCard'
import { PageContainer, PageLayout } from '../../layout/PageLayout'
import { PageTitle } from '../../layout/PageTitle'
import { getLeagueData, League } from '../../utils/leagues'
import { trpc } from '../../utils/trpc'

const MatchesView: FC<{ league: League }> = ({ league }) => {
  const router = useRouter()

  const matchWeek =
    router.query.date && isString(router.query.date)
      ? dayjs(router.query.date)
      : dayjs().startOf('week').add(1, 'day')

  const { data: matches, isLoading: matchesLoading } =
    trpc.matches.allMatches.useQuery({
      league,
      from: matchWeek.toDate(),
      to: matchWeek.endOf('week').add(1, 'day').toDate(),
    })

  const nextWeek = () => {
    router.push({
      pathname: router.pathname,
      query: { league, date: matchWeek.add(1, 'week').format('YYYY-MM-DD') },
    })
  }

  const prevWeek = () => {
    router.push({
      pathname: router.pathname,
      query: {
        league,
        date: matchWeek.subtract(1, 'week').format('YYYY-MM-DD'),
      },
    })
  }

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex">
        <button
          onClick={prevWeek}
          className="group flex items-center justify-center rounded px-2 py-2 hover:bg-slate-200"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            fixedWidth
            className="translate-x-1 transition-transform group-hover:translate-x-0"
          />
        </button>
        <div className="flex-grow text-center">
          <span className="opacity-70">Week of</span>{' '}
          <span className="font-bold">{dayjs(matchWeek).format('DD MMM')}</span>
        </div>
        <button
          onClick={nextWeek}
          className="group flex items-center justify-center rounded px-2 py-2 hover:bg-slate-200"
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            fixedWidth
            className="-translate-x-1 transition-transform group-hover:translate-x-0"
          />
        </button>
      </div>
      {matchesLoading ? (
        <Loader />
      ) : matches && matches.length ? (
        matches.map((match) => (
          <MatchCard key={match.IdMatch} league={league} match={match} />
        ))
      ) : (
        <div className="py-6 text-center text-xl text-gray-500">
          No matches to show
        </div>
      )}
    </div>
  )
}

const MatchesPage: NextPage = () => {
  const router = useRouter()

  const parse = League.safeParse(router.query.league)

  const view = parse.success ? (
    <MatchesView league={parse.data} />
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
        <PageTitle>Matches</PageTitle>
        {view}
      </PageContainer>
    </PageLayout>
  )
}

export default MatchesPage
