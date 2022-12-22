import type { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import { Button } from '../components/Button'
import { ClubCrest } from '../components/ClubCrest'
import { PageContainer, PageLayout } from '../layout/PageLayout'
import { pictureUrl } from '../utils/picture'
import { trpc } from '../utils/trpc'

const ProfilePage: NextPage = () => {
  const { data: session } = useSession()

  const { data } = trpc.teamFollow.getFollowing.useQuery()

  return (
    <PageLayout>
      <Head>
        <title>{`${session?.user?.name || 'Unknown'} | Football`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer>
        <h1 className="text-4xl font-bold">
          Hi{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-6xl text-transparent">
            {session?.user?.name}
          </span>
        </h1>
        <h2>Following</h2>
        <div className="flex gap-4 py-2 px-4">
          {data?.map((team) => (
            <button key={team.IdTeam} className="">
              <ClubCrest imgUrl={pictureUrl(team.PictureUrl, 4)} size="md" />
            </button>
          ))}
        </div>
        <Button onClick={() => signOut()}>Logout</Button>
      </PageContainer>
    </PageLayout>
  )
}

export default ProfilePage
