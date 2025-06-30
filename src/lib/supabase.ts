
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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
