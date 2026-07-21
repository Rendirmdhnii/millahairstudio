import { createClient } from '@supabase/supabase-js';

export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:mm:ss or HH:mm
  status: BookingStatus;
  total_payment: number;
  created_at: string;
}

// Retrieve official Supabase Credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zqpuowsromymlzolqxzv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcHVvd3Nyb215bWx6b2xxeHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2Mzk1NjQsImV4cCI6MjEwMDIxNTU2NH0.of-7lXadLco3XdLLqKwG787OBQQAAq-n-qmUniFKIjw';

// Initialize Supabase Client singleton instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
