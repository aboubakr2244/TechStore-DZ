import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store'

export function Orders() {
  const { orders, formatPrice } = useStore()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Mes Commandes</h1>
        <p className="text-xs text-gray-500 mt-1">Historique de vos achats et suivi de livraison</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#eaeaea] p-12 text-center space-y-4">
          <div className="h-12 w-12 bg-gray-100 rounded-full grid place-items-center mx-auto text-gray-400">
            <Package size={24} />
          </div>
          <h2 className="text-sm font-bold text-gray-900">Aucune commande trouvée</h2>
          <p className="text-xs text-gray-500">Vous n'avez pas encore passé de commande sur TechStore DZ.</p>
          <Link to="/shop" className="inline-block bg-[#111] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#e94b16] transition">
            Commencer mes achats
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-white rounded-3xl border border-[#eaeaea] p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
                <div>
                  <span className="font-bold text-gray-900">Commande </span>
                  <span className="font-mono text-[#e94b16] font-bold">#{order._id || order.orderNumber}</span>
                  <span className="text-gray-400 ml-2">
                    · {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'Aujourd\'hui'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                  <Clock size={12} /> {order.status || 'En cours de préparation'}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-700">
                      {item.name || item.product?.name || 'Produit'} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatPrice((item.price || item.product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-500">Paiement à la livraison (Cash on Delivery)</span>
                <span className="text-base font-black text-[#111]">
                  Total : <span className="text-[#e94b16]">{formatPrice(order.totalPrice || order.total || 0)}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
