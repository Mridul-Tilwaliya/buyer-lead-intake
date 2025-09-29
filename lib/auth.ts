import { createServerSupabaseClient } from './supabase/server'

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null

  // Get or create user in our users table
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!user) {
    // Create user if doesn't exist
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        id: session.user.id,
        email: session.user.email!,
        full_name: session.user.user_metadata?.full_name,
      })
      .select()
      .single()

    return newUser
  }

  return user
}