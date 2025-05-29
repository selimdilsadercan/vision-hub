import { createClient } from "@supabase/supabase-js";

export const supabaseImage = createClient(process.env.NEXT_PUBLIC_SUPABASE_IMAGE_URL!, process.env.NEXT_PUBLIC_SUPABASE_IMAGE_ANON_KEY!);
