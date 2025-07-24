export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
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
      barber_live_location: {
        Row: {
          barber_id: string | null
          client_id: string | null
          current_lat: number
          current_lng: number
          destination_lat: number | null
          destination_lng: number | null
          eta_minutes: number | null
          id: string
          is_en_route: boolean
          updated_at: string
        }
        Insert: {
          barber_id?: string | null
          client_id?: string | null
          current_lat: number
          current_lng: number
          destination_lat?: number | null
          destination_lng?: number | null
          eta_minutes?: number | null
          id?: string
          is_en_route?: boolean
          updated_at?: string
        }
        Update: {
          barber_id?: string | null
          client_id?: string | null
          current_lat?: number
          current_lng?: number
          destination_lat?: number | null
          destination_lng?: number | null
          eta_minutes?: number | null
          id?: string
          is_en_route?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_live_location_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: true
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_live_status: {
        Row: {
          barber_id: string | null
          current_client: string | null
          estimated_finish_time: string | null
          id: string
          last_location_lat: number | null
          last_location_lng: number | null
          status: string
          updated_at: string
        }
        Insert: {
          barber_id?: string | null
          current_client?: string | null
          estimated_finish_time?: string | null
          id?: string
          last_location_lat?: number | null
          last_location_lng?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          barber_id?: string | null
          current_client?: string | null
          estimated_finish_time?: string | null
          id?: string
          last_location_lat?: number | null
          last_location_lng?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_live_status_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: true
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_profiles: {
        Row: {
          address: string | null
          average_rating: number | null
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
          profile_picture_url: string | null
          specialty: string
          status: string
          stripe_account_id: string | null
          total_bookings: number | null
          updated_at: string
          user_id: string | null
          verification_paid_at: string | null
          x_handle: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
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
          profile_picture_url?: string | null
          specialty: string
          status?: string
          stripe_account_id?: string | null
          total_bookings?: number | null
          updated_at?: string
          user_id?: string | null
          verification_paid_at?: string | null
          x_handle?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
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
          profile_picture_url?: string | null
          specialty?: string
          status?: string
          stripe_account_id?: string | null
          total_bookings?: number | null
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
      booking_queue: {
        Row: {
          barber_id: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          estimated_wait_time: number
          id: string
          queue_position: number
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          barber_id?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          estimated_wait_time?: number
          id?: string
          queue_position: number
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          barber_id?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          estimated_wait_time?: number
          id?: string
          queue_position?: number
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_queue_barber_id_fkey"
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
      chat_conversations: {
        Row: {
          barber_id: string | null
          client_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
        }
        Insert: {
          barber_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
        }
        Update: {
          barber_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          message_type: string
          sender_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          message_type?: string
          sender_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          message_type?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
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
      dynamic_pricing: {
        Row: {
          barber_id: string | null
          base_price: number
          created_at: string
          demand_level: string
          effective_until: string | null
          id: string
          service_name: string
          surge_multiplier: number
          updated_at: string
        }
        Insert: {
          barber_id?: string | null
          base_price: number
          created_at?: string
          demand_level?: string
          effective_until?: string | null
          id?: string
          service_name: string
          surge_multiplier?: number
          updated_at?: string
        }
        Update: {
          barber_id?: string | null
          base_price?: number
          created_at?: string
          demand_level?: string
          effective_until?: string | null
          id?: string
          service_name?: string
          surge_multiplier?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_pricing_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_broadcasts: {
        Row: {
          affected_area: string | null
          broadcast_type: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          priority: string
          sender_id: string | null
          title: string
        }
        Insert: {
          affected_area?: string | null
          broadcast_type: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          priority?: string
          sender_id?: string | null
          title: string
        }
        Update: {
          affected_area?: string | null
          broadcast_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          priority?: string
          sender_id?: string | null
          title?: string
        }
        Relationships: []
      }
      feedback_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_name: string
          sender_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_name: string
          sender_type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_name?: string
          sender_type?: string
          user_id?: string
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
      nearby_barber_tracker: {
        Row: {
          area_name: string
          average_wait_time: number
          barber_id: string | null
          current_queue_length: number
          distance_km: number
          id: string
          last_updated: string
        }
        Insert: {
          area_name: string
          average_wait_time?: number
          barber_id?: string | null
          current_queue_length?: number
          distance_km: number
          id?: string
          last_updated?: string
        }
        Update: {
          area_name?: string
          average_wait_time?: number
          barber_id?: string | null
          current_queue_length?: number
          distance_km?: number
          id?: string
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "nearby_barber_tracker_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
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
      photo_gallery: {
        Row: {
          barber_id: string | null
          caption: string | null
          category: string | null
          created_at: string
          id: string
          photo_url: string
        }
        Insert: {
          barber_id?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          id?: string
          photo_url: string
        }
        Update: {
          barber_id?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_gallery_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      real_time_analytics: {
        Row: {
          barber_id: string | null
          created_at: string
          date_recorded: string
          hour_recorded: number
          id: string
          metric_type: string
          metric_value: number
        }
        Insert: {
          barber_id?: string | null
          created_at?: string
          date_recorded?: string
          hour_recorded?: number
          id?: string
          metric_type: string
          metric_value: number
        }
        Update: {
          barber_id?: string | null
          created_at?: string
          date_recorded?: string
          hour_recorded?: number
          id?: string
          metric_type?: string
          metric_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "real_time_analytics_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_profiles"
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
          escrow_released_at: string | null
          escrow_status: string | null
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
          escrow_released_at?: string | null
          escrow_status?: string | null
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
          escrow_released_at?: string | null
          escrow_status?: string | null
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
      typing_indicators: {
        Row: {
          conversation_id: string | null
          id: string
          is_typing: boolean
          last_typed_at: string
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          is_typing?: boolean
          last_typed_at?: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          is_typing?: boolean
          last_typed_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_indicators_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
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
          profile_picture_url: string | null
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
          profile_picture_url?: string | null
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
          profile_picture_url?: string | null
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
      delete_user_account: {
        Args: { user_id_to_delete: string }
        Returns: boolean
      }
      release_escrow_payment: {
        Args: { payment_id: string; admin_user_id: string }
        Returns: boolean
      }
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
