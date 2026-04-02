import { useState, useEffect, useRef } from 'react'
import MessageCard from './MessageCard'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export default function MessageList({
  messages, loading, error, onRetry,
  editingId, onEdit, onSave, onCancel, onDelete,
  busy, currentUserId,
}) {
  const [highlightedIds, setHighlightedIds] = useState(new Set())
  const [showBanner, setShowBanner] = useState(false)
  const listRef = useRef(null)
  const prevLengthRef = useRef(messages.length)

  // Detect new messages from others
  useEffect(() => {
    const newMessages = messages.slice(0, messages.length - prevLengthRef.current)
    const newFromOthers = newMessages.filter((m) => m.isNew)

    if (newFromOthers.length > 0) {
      // Highlight
      const newIds = new Set(newFromOthers.map((m) => m.id))
      setHighlightedIds((prev) => new Set([...prev, ...newIds]))
      setTimeout(() => {
        setHighlightedIds((prev) => {
          const next = new Set(prev)
          newIds.forEach((id) => next.delete(id))
          return next
        })
      }, 2000)

      // Banner if not scrolled to top
      const el = listRef.current
      if (el && el.scrollTop > 100) {
        setShowBanner(true)
      }
    }

    prevLengthRef.current = messages.length
  }, [messages])

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setShowBanner(false)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white px-4 py-3 rounded-xl flex items-center justify-between">
        <span>{error}</span>
        <button onClick={onRetry} className="ml-4 underline text-sm hover:no-underline">Riprova</button>
      </div>
    )
  }

  if (messages.length === 0) {
    return <p className="text-center text-gray-400 py-12">Nessun messaggio ancora. Scrivi qualcosa!</p>
  }

  return (
    <div className="relative">
      {showBanner && (
        <button
          onClick={scrollToTop}
          className="sticky top-0 z-10 w-full mb-2 py-2 bg-blue-500 text-white text-sm rounded-lg font-medium hover:bg-blue-600 transition-colors animate-fade-in"
        >
          Nuovo messaggio ↑
        </button>
      )}

      <div ref={listRef} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {messages.map((msg) => (
          <MessageCard
            key={msg.id}
            message={msg}
            isEditing={editingId === msg.id}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onDelete={onDelete}
            busy={busy}
            currentUserId={currentUserId}
            highlighted={highlightedIds.has(msg.id)}
          />
        ))}
      </div>
    </div>
  )
}
