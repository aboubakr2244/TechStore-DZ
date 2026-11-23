import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck, User } from 'lucide-react'
import { useStore } from '../store'

export function Login() {
  const navigate = useNavigate()
  const { login } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        if (email.includes('admin') || email === 'aboubakr@gmail.com') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        setError(res.error || 'Identifiants invalides')
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async (role) => {
    setLoading(true)
    if (role === 'admin') {
      await login('aboubakr@gmail.com', 'admin123')
      navigate('/admin')
    } else {
      await login('amine@gmail.com', 'password123')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-[#eaeaea] shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-gray-900">Connexion</h1>
          <p className="text-xs text-gray-500">Accédez à votre compte TechStore DZ</p>
        </div>

        {/* Demo Shortcuts */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Comptes Démo 1-Clic</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleDemo('client')}
              className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:border-black py-2 rounded-xl transition shadow-2xs"
            >
              <User size={13} />
              <span>Client (Amine)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="flex items-center justify-center gap-1.5 bg-orange-50 text-[#e94b16] border border-orange-200 hover:bg-orange-100 py-2 rounded-xl transition shadow-2xs"
            >
              <ShieldCheck size={13} />
              <span>Admin (Aboubakr)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-gray-700">Adresse Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 outline-none focus:border-[#111]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-gray-700">Mot de passe</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 outline-none focus:border-[#111]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] hover:bg-[#e94b16] text-white font-bold py-3 rounded-full transition shadow-sm disabled:opacity-50 text-xs"
          >
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-bold text-[#111] hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
