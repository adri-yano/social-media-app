import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Server-side client with service role key for uploads
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

export function getPublicUrl(path) {
  // For public bucket, the public URL pattern is predictable
  return `${supabaseUrl}/storage/v1/object/public/${path}`
}


