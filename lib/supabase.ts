import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Para uso em componentes do cliente (Client Components)
export const createClient_Client = () => {
  return createClientComponentClient<Database>()
}

// Para uso direto em qualquer lugar (não recomendado para componentes do cliente)
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
