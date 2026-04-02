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

export default function UserBadge({ username, size = 'md' }) {
  if (!username) return null
  const sizeClasses = size === 'sm'
    ? 'w-7 h-7 text-xs'
    : 'w-9 h-9 text-sm'

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses} rounded-full flex items-center justify-center text-white font-bold shrink-0 ${getAvatarColor(username)}`}>
        {username.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm font-medium text-gray-700">{username}</span>
    </div>
  )
}
