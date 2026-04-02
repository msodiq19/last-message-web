/** Default days of inactivity before message release */
export const RELEASE_AFTER_DAYS = 14;

/** Reminder schedule: days since last check-in → days left */
export const REMINDER_SCHEDULE = [
  { daysSinceCheckin: 12, daysLeft: 2 },
  { daysSinceCheckin: 13, daysLeft: 1 },
] as const;

/** Max soft-bounce retries per reminder window */
export const MAX_EMAIL_RETRIES = 2;

/** Max encrypted_blob size in bytes (50KB — ~37KB plaintext after base64 overhead) */
export const MAX_MESSAGE_SIZE = 50 * 1024;
