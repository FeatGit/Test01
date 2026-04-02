import { useState } from 'react'
import { supabase } from './lib/supabase'
import { useAuth } from './hooks/useAuth'
import { useProfiles } from './hooks/useProfiles'
import { useMessages } from './hooks/useMessages'
import AuthForm from './components/AuthForm'
import MessageInput from './components/MessageInput'
import MessageList from './components/MessageList'
import UserBadge from './components/UserBadge'

export default function App() {
  const { session, profile, loading: authLoading } = useAuth()
  const profilesHook = useProfiles()
  const currentUserId = session?.user?.id ?? null

  const {
    messages, loading, error, fetchMessages,
    addMessage, updateMessage, deleteMessage,
  } = useMessages(currentUserId, profilesHook)

  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleAdd = async (text) => {
    setBusy(true)
    try { await addMessage(text) }
    catch { showToast('Errore nell\'inserimento del messaggio.') }
    setBusy(false)
  }

  const handleSave = async (id, text) => {
    setBusy(true)
    try { await updateMessage(id, text); setEditingId(null) }
    catch { showToast('Errore nell\'aggiornamento del messaggio.') }
    setBusy(false)
  }

  const handleDelete = async (id) => {
    setBusy(true)
    try { await deleteMessage(id) }
    catch { showToast('Errore nell\'eliminazione del messaggio.') }
    setBusy(false)
  }

  if (authLoading) return null
  if (!session) return <AuthForm />

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Messaggi</h1>
          <div className="flex items-center gap-3">
            {profile && <UserBadge username={profile.username} size="sm" />}
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Esci
            </button>
          </div>
        </div>

        <MessageInput onAdd={handleAdd} disabled={busy} />

        <MessageList
          messages={messages}
          loading={loading}
          error={error}
          onRetry={fetchMessages}
          editingId={editingId}
          onEdit={setEditingId}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
          onDelete={handleDelete}
          busy={busy}
          currentUserId={currentUserId}
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
