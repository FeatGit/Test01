import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useMessages(currentUserId, profilesHook) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
    if (error) {
      setError('Errore nel caricamento dei messaggi.')
    } else {
      setMessages(data)
    }
    setLoading(false)
  }, [])

  // Subscription realtime
  useEffect(() => {
    if (!currentUserId) return

    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const raw = payload.new
          // Fetch profile for the new message
          let profile = profilesHook.getById(raw.user_id)
          if (!profile) {
            const { data } = await supabase
              .from('profiles')
              .select('id, username')
              .eq('id', raw.user_id)
              .single()
            profile = data
            if (profile) profilesHook.addToCache(profile)
          }
          const enriched = {
            ...raw,
            profiles: profile,
            isNew: raw.user_id !== currentUserId,
          }
          setMessages((prev) => {
            // Avoid duplicates (our own insert is already in state via addMessage)
            if (prev.some((m) => m.id === raw.id)) return prev
            return [enriched, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setMessages((prev) =>
            prev.map((m) => m.id === payload.new.id ? { ...m, text: payload.new.text } : m)
          )
        } else if (payload.eventType === 'DELETE') {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
        }
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const addMessage = async (text) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({ text, user_id: currentUserId })
      .select('*, profiles(username)')
      .single()
    if (error) throw error
    // Add optimistically (realtime will deduplicate)
    setMessages((prev) => [data, ...prev])
    return data
  }

  const updateMessage = async (id, text) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ text })
      .eq('id', id)
      .select('*, profiles(username)')
      .single()
    if (error) throw error
    setMessages((prev) => prev.map((m) => (m.id === id ? data : m)))
    return data
  }

  const deleteMessage = async (id) => {
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) throw error
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return { messages, loading, error, fetchMessages, addMessage, updateMessage, deleteMessage }
}
