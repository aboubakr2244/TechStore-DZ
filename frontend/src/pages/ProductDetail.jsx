import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useStore } from '../store'

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, addToCart, formatPrice } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = getProductById(id)

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Produit introuvable</h2>
        <p className="text-xs text-gray-500">Le produit demandé n'existe pas ou a été retiré.</p>
        <Link to="/shop" className="inline-block bg-[#111] text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Retour à la boutique
        </Link>
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#111] mb-6">
        <ArrowLeft size={14} /> Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-[#eaeaea]">
        {/* Left Image */}
        <div className="aspect-square bg-[#f8f8f8] rounded-2xl p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Right Info */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e94b16] bg-orange-50 px-2.5 py-1 rounded-md">
              {product.category || 'High-Tech'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{product.name}</h1>
            <p className="text-2xl font-black text-[#111]">{formatPrice(product.price)}</p>

            <div className="pt-2 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
              <p>{product.description}</p>
            </div>

            {/* Algerian Trust Points */}
            <div className="pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#e94b16]" />
                <span>Livraison rapide 58 Wilayas (Yalidine / ZR Express)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#e94b16]" />
                <span>Garantie officielle 12 mois avec SAV en Algérie</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-gray-600">Quantité :</span>
              <div className="flex items-center border border-gray-200 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-gray-600 hover:text-black"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-gray-600 hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 border border-[#111] hover:bg-gray-50 py-3 rounded-full text-xs font-bold text-[#111] transition"
              >
                {added ? <Check size={15} className="text-emerald-600" /> : <ShoppingBag size={15} />}
                <span>{added ? 'Ajouté !' : 'Ajouter au Panier'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 bg-[#e94b16] hover:bg-orange-600 text-white py-3 rounded-full text-xs font-bold transition shadow-sm"
              >
                <span>Commander Maintenant</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
