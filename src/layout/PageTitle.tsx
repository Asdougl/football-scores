import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

export const PageTitle: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <h1
      className={classNames(
        'mb-5 inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text pb-1 text-6xl font-bold text-transparent',
        className
      )}
    >
      {children}
    </h1>
  )
}
