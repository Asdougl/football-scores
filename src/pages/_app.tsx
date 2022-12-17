import { type AppType } from 'next/app'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { trpc } from '../utils/trpc'
import '../styles/globals.css'
import '../styles/fonts.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

dayjs.extend(isoWeek)

const MyApp: AppType = ({ Component, pageProps }) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default trpc.withTRPC(MyApp)
