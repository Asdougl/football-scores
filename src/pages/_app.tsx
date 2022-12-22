import { type AppType } from 'next/app'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { trpc } from '../utils/trpc'
import '../styles/globals.css'
import '../styles/fonts.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

dayjs.extend(isoWeek)

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
