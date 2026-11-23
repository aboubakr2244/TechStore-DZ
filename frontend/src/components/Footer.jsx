import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, RotateCcw, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#111] text-white border-t border-[#222] mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <Truck className="text-[#e94b16]" size={26} />
            <div>
              <h4 className="text-xs font-bold">Livraison 58 Wilayas</h4>
              <p className="text-[11px] text-gray-400">Yalidine & ZR Express</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#e94b16]" size={26} />
            <div>
              <h4 className="text-xs font-bold">Paiement à la Livraison</h4>
              <p className="text-[11px] text-gray-400">Cash on delivery en DZ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="text-[#e94b16]" size={26} />
            <div>
              <h4 className="text-xs font-bold">Garantie & Retour</h4>
              <p className="text-[11px] text-gray-400">Matériel neuf certifié</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-[#e94b16]" size={26} />
            <div>
              <h4 className="text-xs font-bold">Service Client</h4>
              <p className="text-[11px] text-gray-400">0555 12 34 56 (7j/7)</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 text-xs text-gray-400">
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">TechStore DZ</h3>
            <p className="leading-relaxed">
              Boutique en ligne spécialisée dans les ordinateurs portables, smartphones, accessoires et matériel high-tech en Algérie.
            </p>
            <p className="mt-2 text-gray-500">Alger Centre, 16000 Alger</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Catégories</h3>
            <ul className="space-y-2">
              <li><Link to="/shop?category=Laptops" className="hover:text-white">PC Portables & Mac</Link></li>
              <li><Link to="/shop?category=Smartphones" className="hover:text-white">Smartphones</Link></li>
              <li><Link to="/shop?category=Tablets" className="hover:text-white">Tablettes</Link></li>
              <li><Link to="/shop?category=Audio" className="hover:text-white">Casques & Écouteurs</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-white">Accessoires</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Accès Rapide</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="hover:text-white">Tous les produits</Link></li>
              <li><Link to="/cart" className="hover:text-white">Mon Panier</Link></li>
              <li><Link to="/orders" className="hover:text-white">Suivi de commande</Link></li>
              <li><Link to="/login" className="hover:text-white">Mon Compte</Link></li>
              <li><Link to="/admin" className="text-orange-400 hover:text-orange-300">Espace Administration</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-gray-600 text-[11px] pt-6 border-t border-[#222]">
          © {new Date().getFullYear()} TechStore DZ · Tous droits réservés. Prix affichés en Dinars Algériens (DZ).
        </div>
      </div>
    </footer>
  )
}
