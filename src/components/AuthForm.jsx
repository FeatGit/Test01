import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthForm() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const reset = () => { setError(null); setInfo(null) }

  const handleLogin = async () => {
    reset()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleRegister = async () => {
    reset()
    if (!username.trim()) { setError('Il nome utente è obbligatorio.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim() } },
    })
    if (error) setError(error.message)
    else setInfo('Registrazione avvenuta! Controlla la tua email per confermare.')
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') mode === 'login' ? handleLogin() : handleRegister()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {mode === 'login' ? 'Accedi' : 'Registrati'}
        </h1>

        {mode === 'register' && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nome utente"
            disabled={loading}
            className="block w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        )}

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

        <button
          onClick={mode === 'login' ? handleLogin : handleRegister}
          disabled={loading || !email || !password}
          className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-4"
        >
          {mode === 'login' ? 'Accedi' : 'Registrati'}
        </button>

        <p className="text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <>Non hai un account?{' '}
              <button onClick={() => { setMode('register'); reset() }} className="text-blue-500 hover:underline">
                Registrati
              </button>
            </>
          ) : (
            <>Hai già un account?{' '}
              <button onClick={() => { setMode('login'); reset() }} className="text-blue-500 hover:underline">
                Accedi
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
