import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    setInfo(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    setInfo(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setInfo('Registrazione avvenuta! Controlla la tua email per confermare.')
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSignIn()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Accedi</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Email"
          disabled={loading}
          className="block w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Password"
          disabled={loading}
          className="block w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {info && <p className="text-green-600 text-sm mb-3">{info}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleSignIn}
            disabled={loading || !email || !password}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Accedi
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading || !email || !password}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Registrati
          </button>
        </div>
      </div>
    </div>
  )
}
