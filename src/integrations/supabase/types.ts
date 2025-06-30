export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      barber_availability: {
        Row: {
          barber_id: string | null
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
        }
        Insert: {
          barber_id?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
        }
        Update: {
          barber_id?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_availability_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_profiles: {
        Row: {
          address: string | null
          bank_account_number: string | null
          bank_account_verified: boolean | null
          bank_routing_number: string | null
          business_name: string
          created_at: string
          id: string
          is_verified: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          phone: string
          pricing: string
          specialty: string
          status: string
          stripe_account_id: string | null
          updated_at: string
          user_id: string | null
          verification_paid_at: string | null
          x_handle: string | null
        }
        Insert: {
          address?: string | null
          bank_account_number?: string | null
          bank_account_verified?: boolean | null
          bank_routing_number?: string | null
          business_name: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          phone: string
          pricing: string
          specialty: string
          status?: string
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string | null
          verification_paid_at?: string | null
          x_handle?: string | null
        }
        Update: {
          address?: string | null
          bank_account_number?: string | null
          bank_account_verified?: boolean | null
          bank_routing_number?: string | null
          business_name?: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          phone?: string
          pricing?: string
          specialty?: string
          status?: string
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string | null
          verification_paid_at?: string | null
          x_handle?: string | null
        }
        Relationships: []
      }
      barber_services: {
        Row: {
          barber_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          home_service_available: boolean | null
          home_service_price: number | null
          id: string
          is_active: boolean
          onsite_price: number | null
          price: number
          service_name: string
        }
        Insert: {
          barber_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes: number
          home_service_available?: boolean | null
          home_service_price?: number | null
          id?: string
          is_active?: boolean
          onsite_price?: number | null
          price: number
          service_name: string
        }
        Update: {
          barber_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          home_service_available?: boolean | null
          home_service_price?: number | null
          id?: string
          is_active?: boolean
          onsite_price?: number | null
          price?: number
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_services_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_suggestions: {
        Row: {
          barber_id: string | null
          completed: boolean | null
          created_at: string
          description: string
          id: string
          priority: number | null
          suggestion_type: string
          title: string
          updated_at: string
        }
        Insert: {
          barber_id?: string | null
          completed?: boolean | null
          created_at?: string
          description: string
          id?: string
          priority?: number | null
          suggestion_type: string
          title: string
          updated_at?: string
        }
        Update: {
          barber_id?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string
          id?: string
          priority?: number | null
          suggestion_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_suggestions_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          barber_id: string | null
          booking_date: string
          booking_time: string
          created_at: string
          id: string
          service_type: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          barber_id?: string | null
          booking_date: string
          booking_time: string
          created_at?: string
          id?: string
          service_type: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          barber_id?: string | null
          booking_date?: string
          booking_time?: string
          created_at?: string
          id?: string
          service_type?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_rewards: {
        Row: {
          created_at: string | null
          current_tier: string | null
          discount_percentage: number | null
          id: string
          points_earned: number | null
          total_bookings: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_tier?: string | null
          discount_percentage?: number | null
          id?: string
          points_earned?: number | null
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_tier?: string | null
          discount_percentage?: number | null
          id?: string
          points_earned?: number | null
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          barber_id: string | null
          booking_id: string | null
          created_at: string
          currency: string
          id: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          barber_id?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          status: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          barber_id?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      real_time_payments: {
        Row: {
          amount: number
          barber_id: string | null
          booking_id: string | null
          created_at: string
          currency: string | null
          id: string
          payment_method: string | null
          processed_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          barber_id?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          barber_id?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "real_time_payments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "real_time_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          barber_id: string | null
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          photos: string[] | null
          rating: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          barber_id?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          photos?: string[] | null
          rating: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          barber_id?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          photos?: string[] | null
          rating?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      verification_payments: {
        Row: {
          amount: number
          barber_id: string | null
          created_at: string | null
          id: string
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number
          barber_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          barber_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_payments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
