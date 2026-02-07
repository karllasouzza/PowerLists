import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';
import { mmkvStorage } from '@/data/storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase config:', {
  url: SUPABASE_URL ? 'Set' : 'Missing',
  key: SUPABASE_ANON_KEY ? 'Set' : 'Missing',
});

const mmkvAdapter = {
  getItem: (key: string) => {
    return mmkvStorage.getItem(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    mmkvStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    mmkvStorage.removeItem(key);
  },
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: mmkvAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
