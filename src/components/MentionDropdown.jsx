import { useState, useEffect } from 'react'

export default function MentionDropdown({ query, profiles, onSelect, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = profiles.filter((p) =>
    p.username.toLowerCase().startsWith(query.toLowerCase())
  )

  useEffect(() => { setActiveIndex(0) }, [query])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[activeIndex]) onSelect(filtered[activeIndex].username)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [filtered, activeIndex, onSelect, onClose])

  if (filtered.length === 0) return null

  return (
    <div className="absolute bottom-full left-0 mb-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
      {filtered.map((p, i) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.username)}
          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
            i === activeIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 text-xs flex items-center justify-center font-bold shrink-0">
            {p.username.charAt(0).toUpperCase()}
          </span>
          {p.username}
        </button>
      ))}
    </div>
  )
}
