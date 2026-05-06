export type MessageStatus = "active" | "released";

export interface Message {
  id: string;
  encrypted_blob: string;
  ct_hash: string;
  sender_email: string;
  last_checkin: string;
  release_after: number;
  recipient_email: string;
  status: MessageStatus;
  email_invalid: boolean;
  retry_count: number;
  created_at: string;
  released_at: string | null;
}

export interface CreateMessageRequest {
  encrypted_blob: string;
  ct_hash: string;
  sender_email: string;
  recipient_email: string;
  secret_question: string;
  encrypted_fragment_a: string;
}

export interface CreateMessageResponse {
  id: string;
}
