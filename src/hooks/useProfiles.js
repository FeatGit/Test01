import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProfiles() {
  const cache = useRef(new Map())
  const [profiles, setProfiles] = useState([])
  const fetched = useRef(false)

  const fetchAll = async () => {
    if (fetched.current) return
    fetched.current = true
    const { data } = await supabase.from('profiles').select('id, username')
    if (data) {
      data.forEach((p) => cache.current.set(p.id, p))
      setProfiles(data)
    }
  }

  const getById = (id) => cache.current.get(id) ?? null

  const addToCache = (profile) => {
    if (profile) {
      cache.current.set(profile.id, profile)
      setProfiles([...cache.current.values()])
    }
  }

  return { fetchAll, getById, addToCache, profiles }
}
