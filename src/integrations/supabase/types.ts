export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      gas_banlist: {
        Row: {
          banned_until: string | null
          created_at: string
          id: string
          reason: string | null
          target_user_id: string
          user_id: string
        }
        Insert: {
          banned_until?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          target_user_id: string
          user_id: string
        }
        Update: {
          banned_until?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          target_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      gas_experiments: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          flag_name: string
          flag_value: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          flag_name: string
          flag_value: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          flag_name?: string
          flag_value?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gas_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_id: string
          id: string
          latency_ms: number | null
          metadata: Json | null
          persona: string | null
          reply: string | null
          status: string
          target_user_id: string | null
          template_id: string | null
          text: string | null
          thread_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_id: string
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          persona?: string | null
          reply?: string | null
          status: string
          target_user_id?: string | null
          template_id?: string | null
          text?: string | null
          thread_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_id?: string
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          persona?: string | null
          reply?: string | null
          status?: string
          target_user_id?: string | null
          template_id?: string | null
          text?: string | null
          thread_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gas_ng_words: {
        Row: {
          action: string
          created_at: string
          id: string
          ng_word: string
          user_id: string
        }
        Insert: {
          action?: string
          created_at?: string
          id?: string
          ng_word: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ng_word?: string
          user_id?: string
        }
        Relationships: []
      }
      gas_personas: {
        Row: {
          active: boolean | null
          created_at: string
          display_name: string
          id: string
          name: string
          recent_posts: Json | null
          style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          display_name: string
          id?: string
          name: string
          recent_posts?: Json | null
          style: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          display_name?: string
          id?: string
          name?: string
          recent_posts?: Json | null
          style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gas_rules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          rule_key: string
          rule_value: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          rule_key: string
          rule_value: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          rule_key?: string
          rule_value?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gas_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gas_templates: {
        Row: {
          active: boolean | null
          body: string
          created_at: string
          cta: string | null
          hashtags: string | null
          id: string
          intent: string
          max_len: number | null
          min_len: number | null
          persona: string
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          body: string
          created_at?: string
          cta?: string | null
          hashtags?: string | null
          id?: string
          intent: string
          max_len?: number | null
          min_len?: number | null
          persona: string
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          body?: string
          created_at?: string
          cta?: string | null
          hashtags?: string | null
          id?: string
          intent?: string
          max_len?: number | null
          min_len?: number | null
          persona?: string
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gas_webhook_config: {
        Row: {
          app_id: string
          created_at: string
          gas_webapp_url: string
          hmac_secret: string
          id: string
          is_active: boolean | null
          last_test_at: string | null
          test_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          gas_webapp_url: string
          hmac_secret: string
          id?: string
          is_active?: boolean | null
          last_test_at?: string | null
          test_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          created_at?: string
          gas_webapp_url?: string
          hmac_secret?: string
          id?: string
          is_active?: boolean | null
          last_test_at?: string | null
          test_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string
          id: string
          log_type: string
          message: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          log_type: string
          message: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          log_type?: string
          message?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          created_at: string
          display_name: string
          id: string
          name: string
          recent_posts: string[] | null
          style: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          name: string
          recent_posts?: string[] | null
          style?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          name?: string
          recent_posts?: string[] | null
          style?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_analytics: {
        Row: {
          analytics_date: string
          engagement_rate: number | null
          id: string
          likes_count: number | null
          post_id: string
          recorded_at: string
          replies_count: number | null
          reposts_count: number | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          analytics_date?: string
          engagement_rate?: number | null
          id?: string
          likes_count?: number | null
          post_id: string
          recorded_at?: string
          replies_count?: number | null
          reposts_count?: number | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          analytics_date?: string
          engagement_rate?: number | null
          id?: string
          likes_count?: number | null
          post_id?: string
          recorded_at?: string
          replies_count?: number | null
          reposts_count?: number | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "threads_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          usage_count: number | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          threads_user_id: string | null
          threads_username: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          threads_user_id?: string | null
          threads_username?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          threads_user_id?: string | null
          threads_username?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reply_tests: {
        Row: {
          created_at: string
          generated_reply: string
          id: string
          incoming_reply: string
          original_post: string
          persona_id: string
          test_metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_reply: string
          id?: string
          incoming_reply: string
          original_post: string
          persona_id: string
          test_metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          generated_reply?: string
          id?: string
          incoming_reply?: string
          original_post?: string
          persona_id?: string
          test_metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_tests_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      threads_posts: {
        Row: {
          content: string
          created_at: string
          error_message: string | null
          id: string
          media_urls: string[] | null
          metadata: Json | null
          posted_at: string | null
          scheduled_at: string | null
          status: string
          threads_post_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          media_urls?: string[] | null
          metadata?: Json | null
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
          threads_post_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          media_urls?: string[] | null
          metadata?: Json | null
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
          threads_post_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          auto_reply_enabled: boolean | null
          created_at: string
          id: string
          is_active: boolean | null
          rate_limit_enabled: boolean | null
          rate_limit_requests: number | null
          rate_limit_window: number | null
          updated_at: string
          user_id: string
          verification_token: string | null
          webhook_url: string
        }
        Insert: {
          auto_reply_enabled?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          rate_limit_enabled?: boolean | null
          rate_limit_requests?: number | null
          rate_limit_window?: number | null
          updated_at?: string
          user_id: string
          verification_token?: string | null
          webhook_url: string
        }
        Update: {
          auto_reply_enabled?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          rate_limit_enabled?: boolean | null
          rate_limit_requests?: number | null
          rate_limit_window?: number | null
          updated_at?: string
          user_id?: string
          verification_token?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
