import { MapPin, Phone, Clock } from 'lucide-react'
import { RESTAURANT_INFO } from '@/data/menu'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src="/logo.svg" alt="La Pizz à Papa" className="h-12 w-auto mb-3 brightness-0 invert" />
          <p className="text-sm text-gray-400">Pizzas artisanales, pâte maison, ingrédients frais sélectionnés.</p>
          <a href={RESTAURANT_INFO.facebook} target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            Suivre sur Facebook
          </a>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-3">Contact</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-red-400 shrink-0" />
              <span>{RESTAURANT_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-white">{RESTAURANT_INFO.phone}</a>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-3">Horaires</h3>
          <div className="space-y-1 text-sm">
            {RESTAURANT_INFO.hours.map(h => (
              <div key={h.day} className="flex justify-between gap-4">
                <span className="text-gray-400">{h.day}</span>
                <span className={h.open === false ? 'text-red-400' : 'text-gray-200'}>
                  {h.open === false ? 'Fermé' : h.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />
      <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} La Pizz à Papa – Bourges
        <a href="/admin" className="ml-4 opacity-20 hover:opacity-60 transition-opacity">⚙</a>
      </div>
    </footer>
  )
}
