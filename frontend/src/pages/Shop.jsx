import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Search } from 'lucide-react'
import { useStore } from '../store'
import { ProductCard } from '../components/ProductCard'

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCat = searchParams.get('category') || 'All'
  const initialQuery = searchParams.get('q') || ''

  const { products, loading } = useStore()
  const [category, setCategory] = useState(initialCat)
  const [query, setQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState('default')

  const categories = ['All', 'Laptops', 'Smartphones', 'Tablets', 'Audio', 'Accessories']

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchCat = category === 'All' || (p.category || '').toLowerCase() === category.toLowerCase()
      const matchQuery =
        !query ||
        `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    return result
  }, [products, category, query, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Catalogue & Produits</h1>
        <p className="text-xs text-gray-500 mt-1">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} en Algérie
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#eaeaea] flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c)
                setSearchParams(c === 'All' ? {} : { category: c })
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                category.toLowerCase() === c.toLowerCase()
                  ? 'bg-[#111] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c === 'All' ? 'Tous' : c}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrer..."
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-full py-2 pl-3 pr-8 outline-none focus:border-[#111]"
            />
            <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-2 outline-none"
          >
            <option value="default">Par défaut</option>
            <option value="price-low">Prix : Croissant</option>
            <option value="price-high">Prix : Décroissant</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 p-8">
          <p className="text-sm font-semibold text-gray-700">Aucun produit ne correspond à votre recherche.</p>
          <button
            onClick={() => {
              setCategory('All')
              setQuery('')
              setSearchParams({})
            }}
            className="mt-3 text-xs font-bold text-[#e94b16] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
