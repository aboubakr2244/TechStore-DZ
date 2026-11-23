import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useStore } from '../store'

export function ProductCard({ product }) {
  const { addToCart, isFavorite, toggleFavorite, formatPrice } = useStore()
  const favorited = isFavorite(product.id)

  return (
    <div className="group bg-white rounded-2xl border border-[#eaeaea] p-3 flex flex-col justify-between hover:shadow-lg transition">
      <div>
        {/* Image */}
        <div className="relative aspect-square rounded-xl bg-[#f8f8f8] overflow-hidden flex items-center justify-center p-4">
          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
            />
          </Link>

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 grid place-items-center shadow-xs text-gray-700 hover:text-red-500 transition"
          >
            <Heart size={14} fill={favorited ? '#e94b16' : 'none'} color={favorited ? '#e94b16' : 'currentColor'} />
          </button>

          {/* Stock indicator */}
          {product.stock <= 5 && (
            <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
              Plus que {product.stock} en stock
            </span>
          )}
        </div>

        {/* Info */}
        <div className="pt-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {product.category || 'Tech'}
          </p>
          <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#e94b16] transition line-clamp-1 mt-0.5">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-snug">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price & CTA */}
      <div className="mt-4 pt-2.5 border-t border-[#f4f4f4] flex items-center justify-between">
        <div>
          <span className="text-sm font-black text-[#111]">{formatPrice(product.price)}</span>
        </div>
        <button
          onClick={() => addToCart(product, 1)}
          className="flex items-center gap-1 bg-[#111] hover:bg-[#e94b16] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition shadow-xs"
        >
          <ShoppingBag size={12} />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  )
}
