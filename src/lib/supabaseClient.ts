import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')

  if (error) throw error
  return data
}

export async function createUser(name: string, email: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email })
    .select()
    .single()

  if (error) throw error
  return data
}
