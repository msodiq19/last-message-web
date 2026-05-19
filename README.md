# In Case
**Emotional Continuity Infrastructure**

Your passwords are backed up. Your photos are backed up. 
But what about the things you meant to say?

In Case is an inactivity-triggered continuity platform. It is a silent guardian for your most important words, designed for life interruptions, quiet responsibility, and the things that should not be left unsaid.

---

## The Philosophy
People do not need more time. They need one honest message they never got to hear. 

In Case is built on **trust architecture.** We don't read your messages. We can't. 
Privacy is not a feature or a promise on a marketing page; it is mathematically enforced. 
The system only releases your encrypted message to your chosen recipient if you stop checking in.

## How the Architecture Protects You
1. **Client-Side Encryption:** Messages are encrypted in your browser before they ever touch the network.
2. **Zero-Knowledge Handshake:** Your recipient securely generates their own keys. We do not hold their password or private keys.
3. **The Lockbox:** We store an encrypted blob that can only be unlocked by the recipient's secure key.
4. **Triggered Continuity:** You check in periodically. If you miss your check-in, the system faithfully delivers the encrypted package to your recipient.

## Tech Stack
For developers and builders, this project was architected with:
- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase 
- **Encryption:** Web Crypto API (AES-GCM & RSA)
- **Communications:** Resend

## Setup for Development
1. Clone the repository
2. `cd app`
3. Install dependencies: `npm install`
4. Setup your `.env.local`
5. Run the dev server: `npm run dev`

## License
MIT
