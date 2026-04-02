import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import MessageInput from './components/MessageInput'
import MessageList from './components/MessageList'

export default function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)

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

  const handleAdd = async (text) => {
    setBusy(true)
    const { data, error } = await supabase
      .from('messages')
      .insert({ text })
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

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Messaggi</h1>

        <MessageInput onAdd={handleAdd} disabled={busy} />

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
