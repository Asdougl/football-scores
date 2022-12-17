import type { FC } from 'react'
import type { TimelineEvent } from '../types/timeline'

type TimelineProps = {
  events: TimelineEvent[]
}

export const Timeline: FC<TimelineProps> = ({ events }) => {
  if (!events.length) {
    return (
      <div className="relative w-full gap-4 text-center text-lg opacity-70 lg:py-12">
        <p>Events will be</p>
        <p>posted as they happen</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-slate-200">
      {events.map((event) => (
        <li key={event.Timestamp} className="flex gap-4 px-4 py-3">
          <div className="text-right opacity-70">{event.MatchMinute}</div>
          {event.EventDescription[0]?.Description ||
            event.TypeLocalized[0]?.Description}
          {/* <div className="flex flex-col">
            <span>{event.EventDescription[0]?.Description}</span>
            <span>{event.TypeLocalized[0]?.Description}</span>
            <span>{event.EventId}</span>
            <span>{event.Type}</span>
            <span>{event.TypeLocalized[0]?.Description}</span>
          </div> */}
        </li>
      ))}
    </ul>
  )
}
