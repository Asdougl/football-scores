import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PageContainer, PageLayout } from '../layout/PageLayout'
import { getLeagueData, League } from '../utils/leagues'

const STD_WIDTH = 68
const STD_HEIGHT = 105

const transition = (
  scrollHeight: number,
  stop: number,
  min: number,
  max: number
) => {
  if (scrollHeight > stop) {
    return max
  }

  const travelled = scrollHeight / stop

  return min + (max - min) * travelled
}

const Home: NextPage = () => {
  const [scrollHeight, setScrollHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollHeight(window.scrollY)
    }

    setWindowHeight(window.innerHeight)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const rotateZ = transition(scrollHeight, windowHeight / 3, -60, -90)
  const rotateX = transition(scrollHeight, windowHeight / 3, 45, 0)
  const rotateY = transition(scrollHeight, windowHeight / 3, 50, 0)

  return (
    <PageLayout>
      <Head>
        <title>Football</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <PageContainer className="relative">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="">
            <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-9xl font-bold text-transparent">
              Football Scores
            </h1>
          </div>
          <h2 className="flex gap-6 text-4xl font-bold">
            {League.options.map((league) => {
              const data = getLeagueData(league)
              return (
                <Link href={league} key={league} className="hover:underline">
                  {data.name}
                </Link>
              )
            })}
          </h2>
          <div className="relative mt-32">
            <h3 className="text-9xl font-bold">Live</h3>
            <h3 className="absolute top-1 left-1 -z-10 text-9xl font-bold text-indigo-500 opacity-50">
              Live
            </h3>
            <h3 className="absolute bottom-1 right-1 -z-10 text-9xl font-bold text-pink-500 opacity-50">
              Live
            </h3>
          </div>
          <div className="h-[10000px]"></div>
        </div>
        <div
          className="fixed top-1/2 left-1/2 -z-10 w-[512px] -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: scrollHeight / 500 + 0.1 }}
        >
          <div
            className="relative grid w-full max-w-[512px] grid-rows-2 gap-8 border-2 border-white/60 bg-emerald-500 p-8"
            style={{
              aspectRatio: '1 / 1.54',
              transform: `rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
          >
            <div className="absolute top-1/2 left-0 w-full border-t-2 border-white/60"></div>
            {/* top d */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60"
              style={{
                width: `${((9.15 * 2) / STD_WIDTH) * 100}%`,
                height: `${((9.15 * 2) / STD_HEIGHT) * 100}%`,
                top: `${(11 / STD_HEIGHT) * 100}%`,
              }}
            ></div>
            {/* bottom d */}
            <div
              className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white/60"
              style={{
                width: `${((9.15 * 2) / STD_WIDTH) * 100}%`,
                height: `${((9.15 * 2) / STD_HEIGHT) * 100}%`,
                bottom: `${(11 / STD_HEIGHT) * 100}%`,
              }}
            ></div>
            {/* top penalty box */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 border-2 border-t-0 border-white/60 bg-emerald-500"
              style={{
                width: `${(40.32 / STD_WIDTH) * 100}%`,
                height: `${(16.5 / STD_HEIGHT) * 100}%`,
              }}
            ></div>
            {/* bottom penalty box */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 border-2 border-b-0 border-white/60 bg-emerald-500"
              style={{
                width: `${(40.32 / STD_WIDTH) * 100}%`,
                height: `${(16.5 / STD_HEIGHT) * 100}%`,
              }}
            ></div>
            {/* top 6 yard box */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 border-2 border-t-0 border-white/60"
              style={{
                width: `${(18.32 / STD_WIDTH) * 100}%`,
                height: `${(5.5 / STD_HEIGHT) * 100}%`,
              }}
            ></div>
            {/* bottom 6 yard box */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 border-2 border-b-0 border-white/60"
              style={{
                width: `${(18.32 / STD_WIDTH) * 100}%`,
                height: `${(5.5 / STD_HEIGHT) * 100}%`,
              }}
            ></div>
            {/* top penalty spot */}
            <div
              className="absolute left-1/2 h-1 w-1 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white/60"
              style={{ bottom: `${(11 / STD_HEIGHT) * 100}%` }}
            ></div>
            {/* bottom penalty spot */}
            <div
              className="absolute left-1/2 h-1 w-1 translate-y-1/2 -translate-x-1/2 rounded-full bg-white/60"
              style={{ top: `${(11 / STD_HEIGHT) * 100}%` }}
            ></div>
            {/* centre circle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60"
              style={{
                width: `${((9.15 * 2) / STD_WIDTH) * 100}%`,
                height: `${((9.15 * 2) / STD_HEIGHT) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </PageContainer>
    </PageLayout>
  )
}

export default Home
