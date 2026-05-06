export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          encrypted_blob: string;
          ct_hash: string;
          sender_email: string;
          last_checkin: string;
          release_after: number;
          recipient_email: string;
          status: "active" | "released";
          email_invalid: boolean;
          retry_count: number;
          created_at: string;
          released_at: string | null;
          secret_question: string;
          encrypted_fragment_a: string;
        };
        Insert: {
          id?: string;
          encrypted_blob: string;
          ct_hash: string;
          sender_email: string;
          last_checkin?: string;
          release_after?: number;
          recipient_email: string;
          status?: "active" | "released";
          email_invalid?: boolean;
          retry_count?: number;
          created_at?: string;
          released_at?: string | null;
          secret_question: string;
          encrypted_fragment_a: string;
        };
        Update: {
          id?: string;
          encrypted_blob?: string;
          ct_hash?: string;
          sender_email?: string;
          last_checkin?: string;
          release_after?: number;
          recipient_email?: string;
          status?: "active" | "released";
          email_invalid?: boolean;
          retry_count?: number;
          created_at?: string;
          released_at?: string | null;
          secret_question?: string;
          encrypted_fragment_a?: string;
        };
        Relationships: [];
      };
      vault_items: {
        Row: {
          id: string;
          encrypted_content: string;
          encrypted_fragment_a: string;
          secret_question: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          encrypted_content: string;
          encrypted_fragment_a: string;
          secret_question: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          encrypted_content?: string;
          encrypted_fragment_a?: string;
          secret_question?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
