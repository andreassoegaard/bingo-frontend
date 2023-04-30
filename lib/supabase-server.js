import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

const supabase = createServerComponentSupabaseClient({
  headers,
  cookies,
});

export default supabase;
