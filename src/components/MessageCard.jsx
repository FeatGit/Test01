import { useState, useRef, useEffect } from 'react'
import { parseMentions } from '../utils/mentions'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getAvatarColor(name) {
  if (!name) return 'bg-gray-400'
  let hash = 0
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-rose-500',
    'bg-amber-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  ]
  return colors[Math.abs(hash) % colors.length]
}

function renderWithMentions(text) {
  return parseMentions(text).map((token, i) =>
    token.type === 'mention' ? (
      <span key={i} className="bg-blue-100 text-blue-700 px-1 rounded font-medium">
        @{token.value}
      </span>
    ) : (
      <span key={i}>{token.value}</span>
    )
  )
}

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
)

export default function MessageCard({ message, isEditing, onEdit, onSave, onCancel, onDelete, busy, currentUserId, highlighted }) {
  const [editText, setEditText] = useState(message.text)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const editRef = useRef(null)

  const username = message.profiles?.username ?? '?'
  const isOwner = message.user_id === currentUserId

  useEffect(() => {
    if (isEditing) {
      setEditText(message.text)
      editRef.current?.focus()
    }
  }, [isEditing, message.text])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onCancel()
  }

  const handleSave = () => {
    const trimmed = editText.trim()
    if (!trimmed || busy) return
    onSave(message.id, trimmed)
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 animate-fade-in">
        <input
          ref={editRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={busy}
          className="w-full px-3 py-2 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3 disabled:opacity-50"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} disabled={busy} className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Annulla
          </button>
          <button onClick={handleSave} disabled={!editText.trim() || busy} className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Salva
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 animate-fade-in ${highlighted ? 'animate-highlight' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${getAvatarColor(username)}`}>
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">{username}</p>
          <p className="text-gray-700 break-words">{renderWithMentions(message.text)}</p>
          <p className="text-xs text-gray-400 mt-1">{formatDate(message.created_at)}</p>
        </div>

        {isOwner && (
          confirmDelete ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-gray-600">Sei sicuro?</span>
              <button onClick={() => onDelete(message.id)} disabled={busy} className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors">Sì</button>
              <button onClick={() => setConfirmDelete(false)} disabled={busy} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">No</button>
            </div>
          ) : (
            <div className="flex gap-1 shrink-0">
              <button onClick={() => onEdit(message.id)} disabled={busy} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg disabled:opacity-40 transition-colors" title="Modifica">
                <PencilIcon />
              </button>
              <button onClick={() => setConfirmDelete(true)} disabled={busy} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40 transition-colors" title="Elimina">
                <TrashIcon />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}
