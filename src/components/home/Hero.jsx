import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronRight, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
      {/* Pattern décoratif */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />)}
          <span className="ml-1">4.5/5 · 137 avis</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          La Pizz à Papa
        </h1>
        <p className="text-xl md:text-2xl text-red-100 mb-3">
          Pizzas artisanales à Bourges
        </p>
        <p className="text-red-200 max-w-xl mx-auto mb-10">
          Pâte maison, ingrédients frais sélectionnés, une vingtaine de recettes. Bambino 26 cm ou Papa 33 cm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/menu">
            <Button size="lg" className="bg-white text-red-700 hover:bg-red-50 font-semibold shadow-lg">
              Voir le menu & Commander
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/avis">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Laisser un avis
            </Button>
          </Link>
        </div>

        {/* Déco drapeaux italiens */}
        <div className="mt-16 flex justify-center gap-2 text-2xl opacity-60">
          🇮🇹 🍕 🇮🇹
        </div>
      </div>
    </section>
  )
}
