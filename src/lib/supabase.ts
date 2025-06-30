
import { createClient } from '@supabase/supabase-js'

// Use the actual Supabase project URL and anon key
const supabaseUrl = "https://pspbthubvwgasvorgxkq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGJ0aHVidndnYXN2b3JneGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzk4MjQsImV4cCI6MjA2Njg1NTgyNH0.KKpWfLJlLDwe9xyMRmCpvEbaewvrHTY5g7lAUbmywyw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      barber_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          location: string
          specialty: string
          pricing: string
          x_handle: string | null
          phone: string
          status: 'pending_payment' | 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          location: string
          specialty: string
          pricing: string
          x_handle?: string | null
          phone: string
          status?: 'pending_payment' | 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          location?: string
          specialty?: string
          pricing?: string
          x_handle?: string | null
          phone?: string
          status?: 'pending_payment' | 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          barber_id: string
          booking_date: string
          booking_time: string
          service_type: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          barber_id: string
          booking_date: string
          booking_time: string
          service_type: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          barber_id?: string
          booking_date?: string
          booking_time?: string
          service_type?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
