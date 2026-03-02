/** Default days of inactivity before message release */
export const RELEASE_AFTER_DAYS = 30;

/** Reminder schedule: days since last check-in → days left */
export const REMINDER_SCHEDULE = [
  { daysSinceCheckin: 23, daysLeft: 7 },
  { daysSinceCheckin: 28, daysLeft: 2 },
  { daysSinceCheckin: 29, daysLeft: 1 },
] as const;

/** Max soft-bounce retries per reminder window */
export const MAX_EMAIL_RETRIES = 2;
