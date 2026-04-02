import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined=loading
  const [profile, setProfile] = useState(null)

  const fetchProfile = async (userId) => {
    if (!userId) { setProfile(null); return }
    const { data } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', userId)
      .single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
      fetchProfile(session?.user?.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session ?? null)
      fetchProfile(session?.user?.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, profile, loading: session === undefined }
}
