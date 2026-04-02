import MessageCard from './MessageCard'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/4" />
    </div>
  )
}

export default function MessageList({
  messages,
  loading,
  error,
  onRetry,
  editingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  busy,
  currentAuthor,
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white px-4 py-3 rounded-xl flex items-center justify-between">
        <span>{error}</span>
        <button
          onClick={onRetry}
          className="ml-4 underline text-sm hover:no-underline"
        >
          Riprova
        </button>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        Nessun messaggio ancora. Scrivi qualcosa!
      </p>
    )
  }

  return (
    <div className="space-y-3">
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
          currentAuthor={currentAuthor}
        />
      ))}
    </div>
  )
}
