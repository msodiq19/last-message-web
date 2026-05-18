export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string | null; created_at: string; };
        Insert: { id: string; email: string; full_name?: string | null; created_at?: string; };
        Update: { id?: string; email?: string; full_name?: string | null; created_at?: string; };
      };
      successors: {
        Row: { id: string; user_id: string; email: string; name: string; public_key: string | null; private_key_enc: string | null; created_at: string; };
        Insert: { id?: string; user_id: string; email: string; name: string; public_key?: string | null; private_key_enc?: string | null; created_at?: string; };
        Update: { id?: string; user_id?: string; email?: string; name?: string; public_key?: string | null; private_key_enc?: string | null; created_at?: string; };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          encrypted_blob: string;
          sender_email: string;
          last_checkin: string;
          release_after: number;
          status: "active" | "released";
          email_invalid: boolean;
          retry_count: number;
          created_at: string;
          released_at: string | null;
          temporary_public_key: string | null;
          temporary_private_key_enc: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          encrypted_blob: string;
          sender_email: string;
          last_checkin?: string;
          release_after?: number;
          status?: "active" | "released";
          email_invalid?: boolean;
          retry_count?: number;
          created_at?: string;
          released_at?: string | null;
          temporary_public_key?: string | null;
          temporary_private_key_enc?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          encrypted_blob?: string;
          sender_email?: string;
          last_checkin?: string;
          release_after?: number;
          status?: "active" | "released";
          email_invalid?: boolean;
          retry_count?: number;
          created_at?: string;
          released_at?: string | null;
          temporary_public_key?: string | null;
          temporary_private_key_enc?: string | null;
        };
      };
      message_recipients: {
        Row: { id: string; message_id: string; successor_id: string; encrypted_key: string | null; handshake_token: string; status: "pending" | "handshake_complete" | "delivered" | "read"; created_at: string; };
        Insert: { id?: string; message_id: string; successor_id: string; encrypted_key?: string | null; handshake_token: string; status?: "pending" | "handshake_complete" | "delivered" | "read"; created_at?: string; };
        Update: { id?: string; message_id?: string; successor_id?: string; encrypted_key?: string | null; handshake_token?: string; status?: "pending" | "handshake_complete" | "delivered" | "read"; created_at?: string; };
      };
      activity_logs: {
        Row: { id: string; user_id: string; type: string; details: any; created_at: string; };
        Insert: { id?: string; user_id: string; type: string; details?: any; created_at?: string; };
        Update: { id?: string; user_id?: string; type?: string; details?: any; created_at?: string; };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
