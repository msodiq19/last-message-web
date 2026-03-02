# Last Message
Last Message is an automated fallback for your most critical communications. Write a message, encrypt it client-side, and set a recipient. If you stop checking in, the system ensures your message reaches its destination after 14 days of inactivity.

**No accounts. No logins.**

## How It Works
- Compose & Encrypt: Messages are encrypted in the browser (AES-256-GCM). The server only stores the encrypted blob.
- Secure the Key: You are forced to download a .key file. If you lose this file, the message is permanently unrecoverable.
- Check-in: You receive a unique Check-in URL. Visiting this URL resets your 14-day timer.
- Auto-Release: If 14 days pass without a check-in, the recipient receives a secure link to the encrypted message.
- Recipient Decryption: The recipient uploads your .key file to decrypt and read the message locally


## Tech Stack
- Framework: Next.js 15 (App Router)
- Backend: Supabase (Postgres + Edge Functions)
- Encryption: Web Crypto API (AES-GCM)
- Email: Resend
- Automation: Cron Jobs

## Local Development
1. Clone the repo
2. cd last-message
3. npm install

## Environment Variables
| Variable | Description |
NEXT_PUBLIC_SUPABASE_URL | Supabase project URL. |
NEXT_PUBLIC_SUPABASE_ANON_KEY |	Supabase Publishable Key. |
SUPABASE_SERVICE_ROLE_KEY | Supabase secret key |
RESEND_API_KEY | For delivery of reminders and release links. 
CRON_SECRET | Used to verify cron requests. |
NEXT_PUBLIC_BASE_URL | The production URL. |


## Trust Contract
We rely on your check-ins, not email delivery. Email reminders are a convenience, not a guarantee. If reminders fail and you don't check in, the message will be released.

## License
...