import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import MessageInput from './components/MessageInput'
import MessageList from './components/MessageList'
import LoginForm from './components/LoginForm'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = caricamento, null = non loggato
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError('Errore nel caricamento dei messaggi.')
    } else {
      setMessages(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const currentUser = session?.user

  const handleAdd = async (text) => {
    setBusy(true)
    const { data, error } = await supabase
      .from('messages')
      .insert({ text, author: currentUser.email, user_id: currentUser.id })
      .select()
      .single()
    if (error) {
      showToast('Errore nell\'inserimento del messaggio.')
    } else {
      setMessages((prev) => [data, ...prev])
    }
    setBusy(false)
  }

  const handleEdit = (id) => {
    setEditingId(id)
  }

  const handleSave = async (id, text) => {
    setBusy(true)
    const { data, error } = await supabase
      .from('messages')
      .update({ text })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      showToast('Errore nell\'aggiornamento del messaggio.')
    } else {
      setMessages((prev) => prev.map((m) => (m.id === id ? data : m)))
      setEditingId(null)
    }
    setBusy(false)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    setBusy(true)
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) {
      showToast('Errore nell\'eliminazione del messaggio.')
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id))
    }
    setBusy(false)
  }

  if (session === undefined) return null // attesa check sessione

  if (!session) return <LoginForm />

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Messaggi</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Esci
          </button>
        </div>

        <MessageInput
          onAdd={handleAdd}
          disabled={busy}
        />

        <MessageList
          messages={messages}
          loading={loading}
          error={error}
          onRetry={fetchMessages}
          editingId={editingId}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          busy={busy}
          currentAuthor={currentUser.id}
        />
      </div>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}
