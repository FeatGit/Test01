import { useState, useRef, useEffect } from 'react'
import { useProfiles } from '../hooks/useProfiles'
import MentionDropdown from './MentionDropdown'

export default function MessageInput({ onAdd, disabled }) {
  const [text, setText] = useState('')
  const [mentionQuery, setMentionQuery] = useState(null)
  const inputRef = useRef(null)
  const profilesHook = useProfiles()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const detectMention = (value) => {
    const match = value.match(/@(\w*)$/)
    if (match) {
      if (!profilesHook.profiles.length) profilesHook.fetchAll()
      setMentionQuery(match[1])
    } else {
      setMentionQuery(null)
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setText(value)
    detectMention(value)
  }

  const handleMentionSelect = (username) => {
    const newText = text.replace(/@(\w*)$/, `@${username} `)
    setText(newText)
    setMentionQuery(null)
    inputRef.current?.focus()
  }

  const handleSubmit = async () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    await onAdd(trimmed)
    setText('')
    setMentionQuery(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (mentionQuery !== null) return // delega al dropdown
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="relative flex gap-2 mb-6">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Scrivi un messaggio... (usa @ per menzionare)"
        disabled={disabled}
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Aggiungi
      </button>

      {mentionQuery !== null && (
        <MentionDropdown
          query={mentionQuery}
          profiles={profilesHook.profiles}
          onSelect={handleMentionSelect}
          onClose={() => setMentionQuery(null)}
        />
      )}
    </div>
  )
}
