
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = 'https://ebuxzgjtojwplasunvwr.supabase.co';
// const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidXh6Z2p0b2p3cGxhc3VudndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTAwMDAsImV4cCI6MjA3ODQyNjAwMH0.enRp85ngnHSgcjneTyMQf6jbwJEhZFRMhoqE8a4RifQ" ;

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
import 'react-native-url-polyfill/auto';  // ✅ Add this line
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ebuxzgjtojwplasunvwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidXh6Z2p0b2p3cGxhc3VudndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTAwMDAsImV4cCI6MjA3ODQyNjAwMH0.enRp85ngnHSgcjneTyMQf6jbwJEhZFRMhoqE8a4RifQ';

// ✅ Create a React Native–safe client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // React Native doesn’t use browser redirects
  },
});
