import { z } from 'zod'
import { Localisation } from './common'

export enum EventType {
  GOAL = 0,
  ASSIST = 1,
  YELLOW = 2,
  STRAIGHT_RED = 3,
  SECOND_YELLOW = 4,
  SUBSTITUTION = 5,
  PENALTY = 6,
  START_OF_PERIOD = 7,
  END_OF_PERIOD = 8,
  SHOT = 12,
  FREE_KICK = 14,
  OFFSIDE = 15,
  CORNER = 16,
  FOUL = 18,
  COIN_TOSS = 19,
  UNKNOWN = 20,
  DROP_BALL = 23,
  THROW_IN = 24,
  CLEARANCE = 25,
  FINAL_WHISTLE = 26,
  AERIAL_DUEL = 27,
  OWN_GOAL = 34,
  CONVERTED_PENALTY = 41,
  SAVED_PENALTY = 60,
  VAR = 71,
  SOMETHING = 129,
}

export const isBooking = (type: EventType) =>
  type === EventType.YELLOW ||
  type === EventType.STRAIGHT_RED ||
  type === EventType.SECOND_YELLOW

export const TimelineEvent = z.object({
  EventId: z.string(),
  IdTeam: z.string().optional(),
  IdPlayer: z.string().optional(),
  IdSubPlayer: z.string().optional(),
  IdSubTeam: z.string().optional(),
  Timestamp: z.string(),
  MatchMinute: z.string(),
  Period: z.number(),
  HomeGoals: z.number(),
  AwayGoals: z.number(),
  // Type: z.nativeEnum(EventType),
  Type: z.number(),
  TypeLocalized: Localisation,
  PositionX: z.number().optional(),
  PositionY: z.number().optional(),
  GoalGatePositionY: z.number().optional(),
  GoalGatePositionZ: z.number().optional(),
  HomePenaltyGoals: z.number(),
  AwayPenaltyGoals: z.number(),
  EventDescription: Localisation,
})
export type TimelineEvent = z.infer<typeof TimelineEvent>

export const Timeline = z.object({
  IdStage: z.string(),
  IdMatch: z.string(),
  IdCompetition: z.string(),
  IdSeason: z.string(),
  IdGroup: z.string().nullable(),
  Event: TimelineEvent.array(),
})
