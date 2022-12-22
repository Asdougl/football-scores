import type { FC } from 'react'
import type { TimelineEvent } from '../types/timeline'
import { EventType } from '../types/timeline'

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

  let hasUnknownEvents = false

  const eventsElements = events.map((event) => {
    const eventKnown = Object.values(EventType).includes(event.Type)
    if (!eventKnown) hasUnknownEvents = true

    return (
      <li key={event.Timestamp} className="flex gap-4 px-4 py-3">
        <div className="text-right opacity-70">{event.MatchMinute}</div>

        {process.env.NODE_ENV === 'development' ? (
          <>
            <span>{event.EventDescription[0]?.Description}</span>
            &bull;
            <span>{event.TypeLocalized[0]?.Description}</span>
            &bull;
            <span>{event.EventId}</span>
            &bull;
            <span>evt {event.Type}</span>
            &bull;
            <span>{eventKnown ? 'known' : 'unknown'}</span>
          </>
        ) : (
          event.EventDescription[0]?.Description ||
          event.TypeLocalized[0]?.Description
        )}
      </li>
    )
  })

  return (
    <>
      {process.env.NODE_ENV === 'development' && hasUnknownEvents && (
        <div className="mt-4 flex justify-center text-sm text-slate-500">
          <p>Some events are not yet supported</p>
        </div>
      )}
      <ul className="flex flex-col divide-y divide-slate-200">
        {eventsElements}
      </ul>
    </>
  )
}
