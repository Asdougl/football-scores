import type { IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import {
  faHeart,
  faUserCircle,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { League, getLeagueData } from '../utils/leagues'

interface NavItemPropsBase {
  isActive: boolean
  icon: IconDefinition
  color: 'indigo' | 'purple' | 'pink'
}

interface NavItemPropsLink extends NavItemPropsBase {
  href: string
}

interface NavItemPropsButton extends NavItemPropsBase {
  onClick: () => void
}

type NavItemProps = NavItemPropsLink | NavItemPropsButton

type NavItemPropsWithText = NavItemProps & { text: string }

const isLink = (props: NavItemProps): props is NavItemPropsLink => {
  return 'href' in props
}

const DesktopNavItem: FC<NavItemPropsWithText> = (props) => {
  const { isActive, icon, text, color } = props

  const contents = (
    <>
      <FontAwesomeIcon icon={icon} fixedWidth /> {text}
    </>
  )

  const className = classNames(
    'rounded px-3 py-1 transition-colors hover:text-white',
    {
      'text-white': isActive,
      'bg-indigo-500': isActive && color === 'indigo',
      'bg-purple-500': isActive && color === 'purple',
      'bg-pink-500': isActive && color === 'pink',
      'hover:bg-indigo-500': color === 'indigo',
      'hover:bg-purple-500': color === 'purple',
      'hover:bg-pink-500': color === 'pink',
    }
  )

  return isLink(props) ? (
    <Link href={props.href} className={className}>
      {contents}
    </Link>
  ) : (
    <button onClick={props.onClick} className={className}>
      {contents}
    </button>
  )
}

const MobileNavItem: FC<NavItemProps> = (props) => {
  const { isActive, icon, color } = props

  const contents = (
    <>
      <FontAwesomeIcon icon={icon} fixedWidth />
      {isActive && (
        <div
          className={classNames(
            'absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-colors group-hover:bg-white',
            {
              'bg-pink-500': color === 'pink',
              'bg-purple-500': color === 'purple',
              'bg-indigo-500': color === 'indigo',
            }
          )}
        ></div>
      )}
    </>
  )

  const className = classNames(
    'group relative flex items-center justify-center gap-2 rounded px-3 py-3 transition-colors hover:text-white',
    {
      'text-pink-500': isActive && color === 'pink',
      'hover:text-pink-500': color === 'pink',
      'text-purple-500': isActive && color === 'purple',
      'hover:text-purple-500': color === 'purple',
      'text-indigo-500': isActive && color === 'indigo',
      'hover:text-indigo-500': color === 'indigo',
    }
  )

  return isLink(props) ? (
    <Link href={props.href} className={className}>
      {contents}
    </Link>
  ) : (
    <button onClick={props.onClick} className={className}>
      {contents}
    </button>
  )
}

export const Header: FC<{ league?: League }> = ({ league }) => {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const leagueData = league && getLeagueData(league)

  const { data: session } = useSession()

  return (
    <div className="sticky top-0 z-10 h-16 w-full">
      <div className="absolute top-0 left-0 w-full px-4 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-2xl font-bold hover:bg-gradient-to-r hover:text-transparent"
            >
              <div className="relative h-[0.7em] w-[0.7em] rounded-full bg-black group-hover:bg-indigo-500"></div>
              <h1>Football Scores</h1>
            </Link>
          </div>
          <div className="hidden gap-4 lg:flex">
            <DesktopNavItem
              onClick={() => setShowMenu((showMenu) => !showMenu)}
              isActive={!!router.asPath.match(new RegExp(`^/${league}(\\?|$)`))}
              icon={showMenu ? faChevronUp : faChevronDown}
              text={leagueData?.name || 'Leagues'}
              color="indigo"
            />
            {session ? (
              <>
                <DesktopNavItem
                  href={`/scores`}
                  isActive={router.asPath === `/scores`}
                  icon={faHeart}
                  text="My Scores"
                  color="purple"
                />
                <DesktopNavItem
                  href={`/profile`}
                  isActive={router.asPath === `/profile`}
                  icon={faUserCircle}
                  text={session.user?.name || 'Profile'}
                  color="pink"
                />
              </>
            ) : (
              <DesktopNavItem
                onClick={signIn}
                isActive={router.asPath === `/login`}
                icon={faUserCircle}
                text="Login"
                color="pink"
              />
            )}
          </div>
        </div>
        {showMenu && (
          <div className="hidden shadow-lg lg:block">
            <div className="container mx-auto grid lg:grid-cols-4">
              {League.options.map((league) => (
                <Link
                  key={league}
                  href={`/${league}`}
                  className={classNames(
                    'flex items-center gap-2 whitespace-nowrap px-4 py-4 text-2xl font-bold hover:opacity-50'
                  )}
                  onClick={() => setShowMenu(false)}
                >
                  <div
                    className={classNames('w-full text-center', {
                      'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent':
                        router.asPath.includes(league),
                    })}
                  >
                    {getLeagueData(league).name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 flex w-screen flex-col bg-white pb-4 lg:hidden">
        {showMenu && (
          <div className="container mx-auto grid lg:grid-cols-4">
            {League.options.map((league) => (
              <Link
                key={league}
                href={`/${league}`}
                className={classNames(
                  'flex items-center gap-2 whitespace-nowrap px-4 py-1 text-2xl font-bold hover:opacity-50'
                )}
                onClick={() => setShowMenu(false)}
              >
                <div
                  className={classNames('w-full text-center', {
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
        <div className={`container mx-auto grid grid-cols-3 gap-4 px-4 py-2`}>
          <MobileNavItem
            href={`/scores`}
            isActive={router.asPath === `/scores`}
            icon={faHeart}
            color="purple"
          />
          <MobileNavItem
            onClick={() => setShowMenu((showMenu) => !showMenu)}
            isActive={!!router.asPath.match(new RegExp(`^/${league}(\\?|$)`))}
            icon={showMenu ? faChevronDown : faChevronUp}
            color="indigo"
          />
          {session ? (
            <MobileNavItem
              href={`/profile`}
              isActive={router.asPath === `/profile`}
              icon={faUserCircle}
              color="pink"
            />
          ) : (
            <MobileNavItem
              onClick={() => (session ? signOut() : signIn())}
              isActive={router.asPath === `/login`}
              icon={faUserCircle}
              color="pink"
            />
          )}
        </div>
      </div>
    </div>
  )
}
