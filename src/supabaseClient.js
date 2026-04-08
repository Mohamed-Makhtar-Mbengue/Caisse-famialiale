import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ofgkbzjkvgbjyrxornra.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_HAGAe8zHBXDV_oLQBlKQkw_3DeGQLC0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
