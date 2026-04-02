import { useState, useRef, useEffect } from 'react'

export default function MessageInput({ onAdd, disabled, authorName, onAuthorChange }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async () => {
    const trimmed = text.trim()
    if (!trimmed || !authorName.trim() || disabled) return
    await onAdd(trimmed)
    setText('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="mb-6 space-y-2">
      <input
        type="text"
        value={authorName}
        onChange={(e) => onAuthorChange(e.target.value)}
        placeholder="Il tuo nome"
        disabled={disabled}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
      />
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi un messaggio..."
          disabled={disabled}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || !authorName.trim() || disabled}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Aggiungi
        </button>
      </div>
    </div>
  )
}
