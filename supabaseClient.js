
// import 'react-native-url-polyfill/auto';
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = 'https://ebuxzgjtojwplasunvwr.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidXh6Z2p0b2p3cGxhc3VudndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTAwMDAsImV4cCI6MjA3ODQyNjAwMH0.enRp85ngnHSgcjneTyMQf6jbwJEhZFRMhoqE8a4RifQ';

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: false,
//   },
// });

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ebuxzgjtojwplasunvwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidXh6Z2p0b2p3cGxhc3VudndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTAwMDAsImV4cCI6MjA3ODQyNjAwMH0.enRp85ngnHSgcjneTyMQf6jbwJEhZFRMhoqE8a4RifQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});