import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'
import type { League } from '../utils/leagues'
import { Header } from './Header'

export const PageLayout: FC<PropsWithChildren<{ league?: League }>> = ({
  children,
  league,
}) => {
  return (
    <>
      <Header league={league} />
      {children}
    </>
  )
}

export const PageContainer: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        'container mx-auto px-4 pt-2 pb-24 lg:px-0 lg:pb-16 lg:pt-8',
        className
      )}
    >
      {children}
    </div>
  )
}
