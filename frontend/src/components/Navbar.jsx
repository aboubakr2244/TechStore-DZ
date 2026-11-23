import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, LogOut, Package, Search, ShieldCheck, ShoppingBag, User } from 'lucide-react'
import { useStore } from '../store'

export function Navbar() {
  const navigate = useNavigate()
  const { cartCount, favorites, currentUser, logout } = useStore()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?q=${encodeURIComponent(search.trim())}`)
    } else {
      navigate('/shop')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#eaeaea]">
      {/* Top Banner */}
      <div className="bg-[#111] text-white text-[11px] py-1.5 px-4 text-center">
        <span>🚚 Livraison disponible sur <strong>58 Wilayas</strong> (Yalidine / ZR) · Paiement à la livraison (Cash on Delivery) en <strong>DZ</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#111]">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#e94b16] text-white font-black text-sm">
            DZ
          </span>
          <span>TechStore<span className="text-[#e94b16]">.dz</span></span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit (iPhone, PC, Casque...)..."
            className="w-full rounded-full border border-[#ddd] bg-[#f8f8f8] py-2 pl-4 pr-10 text-xs outline-none focus:border-[#111] focus:bg-white transition"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[#777] hover:text-[#111]">
            <Search size={15} />
          </button>
        </form>

        {/* Links & Actions */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold">
          <Link to="/shop" className="hover:text-[#e94b16] transition hidden sm:block">
            Boutique
          </Link>

          {currentUser && (
            <Link to="/orders" className="hover:text-[#e94b16] transition flex items-center gap-1">
              <Package size={15} />
              <span className="hidden sm:inline">Mes Commandes</span>
            </Link>
          )}

          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-[#e94b16] bg-orange-50 px-2.5 py-1.5 rounded-full border border-orange-200 hover:bg-orange-100 transition"
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 transition text-[#111]"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#e94b16] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Menu */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 hidden sm:inline">Bonjour, <strong>{currentUser.name}</strong></span>
              <button
                onClick={logout}
                title="Déconnexion"
                className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-full bg-[#111] text-white px-4 py-2 hover:bg-[#e94b16] transition text-xs font-bold"
            >
              <User size={14} />
              <span>Connexion</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
