import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useStore } from '../store'

export function Cart() {
  const navigate = useNavigate()
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartSubtotal, shippingFee, cartTotal, formatPrice } = useStore()

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="h-16 w-16 bg-gray-100 rounded-full grid place-items-center mx-auto text-gray-400">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-bold">Votre panier est vide</h2>
        <p className="text-xs text-gray-500">Découvrez nos produits et profitez de la livraison sur 58 Wilayas.</p>
        <Link to="/shop" className="inline-block bg-[#111] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#e94b16] transition">
          Découvrir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Mon Panier ({cart.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-2xl border border-[#eaeaea] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 object-contain rounded-xl bg-gray-50 p-2 shrink-0 mix-blend-multiply"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-xs font-black text-[#e94b16] mt-0.5">{formatPrice(product.price)}</p>
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center border border-gray-200 rounded-full">
                  <button
                    onClick={() => updateCartQuantity(product.id, quantity - 1)}
                    className="px-2.5 py-1 text-xs font-bold text-gray-500 hover:text-black"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(product.id, quantity + 1)}
                    className="px-2.5 py-1 text-xs font-bold text-gray-500 hover:text-black"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={clearCart}
              className="text-xs text-gray-500 hover:text-red-600 font-semibold"
            >
              Vider le panier
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-3xl border border-[#eaeaea] space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Récapitulatif de Commande</h2>

          <div className="space-y-2.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-bold text-gray-900">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span className="font-bold text-gray-900">
                {shippingFee === 0 ? 'Gratuit' : formatPrice(shippingFee)}
              </span>
            </div>
            {shippingFee === 0 && (
              <p className="text-[10px] text-emerald-600 font-semibold">
                ✓ Livraison offerte dès 20 000 DZ
              </p>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-black text-gray-900">
              <span>Total à payer</span>
              <span className="text-[#e94b16]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 bg-[#e94b16] hover:bg-orange-600 text-white font-bold py-3.5 rounded-full text-xs transition shadow-sm"
          >
            <span>Passer à la Caisse</span>
            <ArrowRight size={14} />
          </button>

          <p className="text-[10px] text-center text-gray-400">
            Paiement en espèces à la livraison (Cash on Delivery)
          </p>
        </div>
      </div>
    </div>
  )
}
