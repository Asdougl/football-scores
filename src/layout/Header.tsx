import {
  faBarChart,
  faBoxingGlove,
  faCalendarDay,
  faHome,
} from '@fortawesome/pro-regular-svg-icons'
import type { IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { League, getLeagueData } from '../utils/leagues'

const DesktopNavItem: FC<{
  isActive: boolean
  href: string
  icon: IconDefinition
  text: string
}> = ({ isActive, href, icon, text }) => {
  return (
    <Link
      href={href}
      className={classNames(
        'rounded px-3 py-1 transition-colors hover:bg-indigo-500 hover:text-white',
        {
          'bg-indigo-500 text-white': isActive,
        }
      )}
    >
      <FontAwesomeIcon icon={icon} fixedWidth /> {text}
    </Link>
  )
}

const MobileNavItem: FC<{
  isActive: boolean
  href: string
  icon: IconDefinition
}> = ({ isActive, href, icon }) => {
  return (
    <Link
      href={href}
      className={classNames(
        'group relative flex items-center justify-center gap-2 rounded px-3 py-3 transition-colors hover:bg-pink-500 hover:text-white',
        {
          'text-pink-500': isActive,
        }
      )}
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
      {isActive && (
        <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-pink-500 transition-colors group-hover:bg-white"></div>
      )}
    </Link>
  )
}

export const Header: FC<{ league?: League }> = ({ league }) => {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const leagueData = league && getLeagueData(league)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="absolute top-0 left-0 h-full w-full backdrop-blur-md"></div>
      <div className="container relative mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="">
            <button
              onClick={() => setShowMenu((showMenu) => !showMenu)}
              className="group flex items-center justify-center gap-2 from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-2xl font-bold hover:bg-gradient-to-r hover:text-transparent"
            >
              <div className="relative h-[0.7em] w-[0.7em] rounded-full bg-black group-hover:bg-indigo-500">
                <FontAwesomeIcon
                  icon={showMenu ? faChevronUp : faChevronDown}
                  fixedWidth
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white opacity-0 group-hover:opacity-100"
                />
              </div>
              <h1>{leagueData?.name || 'Football Scores'}</h1>
            </button>
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute top-0 left-0 flex w-screen flex-col shadow-lg lg:max-w-lg"
              >
                {League.options.map((league) => (
                  <Link
                    key={league}
                    href={`/${league}`}
                    className={classNames(
                      'flex items-center gap-2 whitespace-nowrap bg-white px-4 py-4 text-2xl font-bold hover:bg-slate-50'
                    )}
                    onClick={() => setShowMenu(false)}
                  >
                    <div
                      className={`h-[0.7em] w-[0.7em] rounded-full ${
                        router.asPath.includes(league)
                          ? 'bg-indigo-500'
                          : 'bg-black'
                      }`}
                    ></div>
                    <div
                      className={classNames({
                        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent':
                          router.asPath.includes(league),
                      })}
                    >
                      {getLeagueData(league).name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="hidden gap-4 lg:flex">
            {leagueData && (
              <>
                <DesktopNavItem
                  href={`/${league}`}
                  isActive={router.asPath === `/${league}`}
                  icon={faHome}
                  text="League"
                />
                <DesktopNavItem
                  href={`/${league}/matches`}
                  isActive={router.asPath.includes(`/${league}`)}
                  icon={faCalendarDay}
                  text="Matches"
                />
                {leagueData.hasKnockout && (
                  <DesktopNavItem
                    href={`/${league}/knockout`}
                    isActive={router.asPath === `/${league}/knockout`}
                    icon={faBoxingGlove}
                    text="Knockout"
                  />
                )}
                <DesktopNavItem
                  href={`/${league}/standings`}
                  isActive={router.asPath === `/${league}/standings`}
                  icon={faBarChart}
                  text="Standings"
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 flex w-screen gap-4 bg-white pb-4 lg:hidden">
        {leagueData && (
          <div
            className={`container mx-auto grid gap-4 px-4 py-2 ${
              leagueData.hasKnockout ? 'grid-cols-4' : 'grid-cols-3'
            }`}
          >
            <MobileNavItem
              href={`/${league}`}
              isActive={router.asPath === `/${league}`}
              icon={faHome}
            />
            <MobileNavItem
              href={`/${league}/matches`}
              isActive={router.asPath.includes(`/${league}/matches`)}
              icon={faCalendarDay}
            />
            {leagueData.hasKnockout && (
              <MobileNavItem
                href={`/${league}/knockout`}
                isActive={router.asPath === `/${league}/knockout`}
                icon={faBoxingGlove}
              />
            )}
            <MobileNavItem
              href={`/${league}/standings`}
              isActive={router.asPath === `/${league}/standings`}
              icon={faBarChart}
            />
          </div>
        )}
      </div>
    </div>
  )
}
