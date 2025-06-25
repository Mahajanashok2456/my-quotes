import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmsaezuwqtkcyefdiwri.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tc2FlenV3cXRrY3llZmRpd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTMyODIsImV4cCI6MjA2NjQyOTI4Mn0.K4xL-EWR4kDjmnFfoTCp40aT8L7a3OXn8aDXPJ9dRWc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 