import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'
import { useStore } from '../store'

export function Register() {
  const navigate = useNavigate()
  const { signup } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères')
      return
    }

    setLoading(true)
    try {
      const res = await signup(name, email, password)
      if (res.success) {
        navigate('/')
      } else {
        setError(res.error || 'Erreur lors de la création du compte')
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-[#eaeaea] shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-gray-900">Créer un Compte</h1>
          <p className="text-xs text-gray-500">Rejoignez TechStore DZ pour commander en toute simplicité</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-gray-700">Nom Complet</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Mohamed Amine"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 outline-none focus:border-[#111]"
              />
            </div>
          </div>

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
                placeholder="6 caractères minimum"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 outline-none focus:border-[#111]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] hover:bg-[#e94b16] text-white font-bold py-3 rounded-full transition shadow-sm disabled:opacity-50 text-xs"
          >
            {loading ? 'Création...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-[#111] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
