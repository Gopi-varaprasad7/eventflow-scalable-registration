export interface EventRegistrationEvent {
  userId: string
  eventId: string
  registeredAt: string
  retryCount?: number
}

export interface EventCreatedEvent {
  eventId: string
  title: string
  capacity: number
  createdAt: string
}

export interface WaitlistPromotedEvent {
  userId: string
  eventId: string
  promotedAt: string
}