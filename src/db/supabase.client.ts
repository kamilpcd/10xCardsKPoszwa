import { createClient } from '@supabase/supabase-js';

import type { Database } from '../db/database.types';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey); 

export type SupabaseClient = typeof supabaseClient;

export const DEFAULT_USER_ID = "d4b6b8a3-40d4-4e3b-b1b7-e37c4efa3397"