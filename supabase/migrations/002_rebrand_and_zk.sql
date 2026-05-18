-- 002_rebrand_and_zk.sql

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS successors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  public_key TEXT, -- Provided by successor during handshake, PEM or JWK format
  private_key_enc TEXT, -- Successor's private key encrypted with their Access Password
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, email)
);
ALTER TABLE successors ENABLE ROW LEVEL SECURITY;

-- Note: In a real database we would ALTER messages carefully to avoid breaking existing data.
-- But since this is a new project, we are reshaping `messages` entirely.
-- Just drop the legacy columns and add the new exact ones.
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS temporary_public_key TEXT,
  ADD COLUMN IF NOT EXISTS temporary_private_key_enc TEXT;

ALTER TABLE messages DROP COLUMN IF EXISTS secret_question;
ALTER TABLE messages DROP COLUMN IF EXISTS encrypted_fragment_a;
ALTER TABLE messages DROP COLUMN IF EXISTS ct_hash;
ALTER TABLE messages DROP COLUMN IF EXISTS recipient_email;

CREATE TABLE IF NOT EXISTS message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  successor_id UUID NOT NULL REFERENCES successors(id) ON DELETE CASCADE,
  encrypted_key TEXT, -- The symmetric key unlocking the message, encrypted by the successor's public key
  handshake_token TEXT UNIQUE, -- Token sent to successor to initiate key exchange
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'handshake_complete', 'delivered', 'read')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, successor_id)
);
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- We could define specific RLS policies here, but for now we'll allow all operations 
-- assuming middleware and edge functions ensure the user logic at application level.
-- (This allows rapid MVP prototyping of the architecture.)

CREATE POLICY "Allow all profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all successors" ON successors FOR ALL USING (true);
CREATE POLICY "Allow all message_recipients" ON message_recipients FOR ALL USING (true);
CREATE POLICY "Allow all activity_logs" ON activity_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Anyone can create messages" ON messages;
DROP POLICY IF EXISTS "Anyone can read released messages" ON messages;
CREATE POLICY "Allow all messages" ON messages FOR ALL USING (true);
