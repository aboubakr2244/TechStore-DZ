import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Laptop, Smartphone, Tablet, Headphones, Shield, Truck } from 'lucide-react'
import { useStore } from '../store'
import { ProductCard } from '../components/ProductCard'

export function Home() {
  const { products, loading } = useStore()
  const featured = products.slice(0, 8)

  const categories = [
    { name: 'Laptops', label: 'PC Portables', icon: Laptop, count: 'MacBook & Gaming' },
    { name: 'Smartphones', label: 'Smartphones', icon: Smartphone, count: 'iPhone, Galaxy, Pixel' },
    { name: 'Tablets', label: 'Tablettes', icon: Tablet, count: 'iPad & Android' },
    { name: 'Audio', label: 'Casques & Audio', icon: Headphones, count: 'AirPods & Sony' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      {/* Hero */}
      <section className="relative rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 sm:p-14 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-[#e94b16] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            🇩🇿 Boutique High-Tech Algérie
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Les meilleures technologies au meilleur prix en <span className="text-[#e94b16]">Dinars DZ</span>
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Ordinateurs portables, smartphones haut de gamme et accessoires officiels avec livraison sécurisée à domicile sur 58 Wilayas et paiement à la livraison.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#e94b16] hover:bg-orange-600 text-white text-xs font-bold px-6 py-3 rounded-full transition shadow-md"
            >
              <span>Voir le catalogue</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/shop?category=Laptops"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-3 rounded-full transition"
            >
              <span>PC Portables</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Parcourir par Catégorie</h2>
          <Link to="/shop" className="text-xs font-semibold text-[#e94b16] hover:underline">
            Tout voir →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="bg-white border border-[#eaeaea] hover:border-[#111] p-4 rounded-2xl flex items-center gap-3 transition group"
              >
                <div className="h-10 w-10 rounded-xl bg-gray-50 group-hover:bg-orange-50 grid place-items-center text-gray-700 group-hover:text-[#e94b16] transition">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">{cat.label}</h3>
                  <p className="text-[10px] text-gray-500">{cat.count}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Produits Disponibles</h2>
            <p className="text-xs text-gray-500">Matériel neuf en stock avec garantie</p>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-[#e94b16] hover:underline">
            Voir toute la boutique →
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-xs">Chargement des produits...</div>
        ) : featured.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-xs">Aucun produit disponible.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
