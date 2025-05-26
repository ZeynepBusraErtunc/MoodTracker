import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tloyfdizoclpzkltiodt.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3lmZGl6b2NscHprbHRpb2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjY1NjYsImV4cCI6MjA2MjkwMjU2Nn0.iM4K4YQYNrLmzpJqL6JnCxMkHBm8YxofDFUULc7GGTs'; 

export const supabase = createClient(supabaseUrl, supabaseKey);