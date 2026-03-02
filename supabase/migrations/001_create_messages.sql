-- 001_create_messages.sql
-- Last Message MVP: initial schema

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_blob  TEXT NOT NULL,
  ct_hash         TEXT NOT NULL UNIQUE,
  sender_email    TEXT NOT NULL,
  last_checkin    TIMESTAMPTZ NOT NULL DEFAULT now(),
  release_after   INTEGER NOT NULL DEFAULT 14,  -- days, not user-configurable in MVP
  recipient_email TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'released')),
  email_invalid   BOOLEAN NOT NULL DEFAULT false,
  retry_count     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  released_at     TIMESTAMPTZ
);

-- Index for cron job: quickly find active messages
CREATE INDEX IF NOT EXISTS idx_messages_status
  ON messages (status) WHERE status = 'active';

-- Index for check-in lookups by ct_hash
CREATE INDEX IF NOT EXISTS idx_messages_ct_hash
  ON messages (ct_hash);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (create messages) via anon key
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Anyone can read released messages by ID (for recipient)
CREATE POLICY "Anyone can read released messages"
  ON messages FOR SELECT
  USING (status = 'released');
