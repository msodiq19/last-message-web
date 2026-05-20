# Contributing to In Case

First of all, thank you for taking the time to review the code.

**In Case is open source primarily for trust, transparency, and security auditing.** Because this tool handles highly sensitive emotional continuity data, the exact specification is strictly locked down.

## Open Source Philosophy

We operate under a "Benevolent Dictator" model to prevent feature creep and protect the core user experience. This means:

*   **We are NOT accepting feature requests.** PRs adding new buttons, integrations, themes, or complex structural changes will be politely closed. The simplicity of the product is its primary feature. 
*   **We welcome bug fixes.** If the UI breaks on a specific device or standard React lifecycle errors exist, minor fixes are appreciated.
*   **We rely on security auditing.** The codebase is public specifically so cryptographers and security engineers can verify our zero-knowledge claims. If you find a security hole, **do not open a PR or Issue.** Read our [`SECURITY.md`](SECURITY.md) to report it privately.

## Local Setup

If you want to run this locally for your own review or self-hosting:

1. Copy `.env.example` to `.env.local` and fill in your Supabase variables.
2. Run database migrations inside `supabase/migrations/`.
3. `npm install` and `npm run dev`.

Thank you for understanding our strict scope. By maintaining a rigid perimeter around what In Case does, we protect the gravity of what it holds.
