import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njyrcizivfrbgulsgrdv.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeXJjaXppdmZyYmd1bHNncmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTE3NzMsImV4cCI6MjA2ODY4Nzc3M30.4AAF1mdJqoqxXRPKEx4TuqoP-nvR9Lu1OcpCd8W3yJU'; 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);