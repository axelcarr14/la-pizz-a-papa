import { Clock, MapPin, Phone } from 'lucide-react'
import { RESTAURANT_INFO } from '@/data/menu'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function isOpenNow() {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  const min = now.getMinutes()
  const time = hour * 60 + min
  if (day === 1) return false
  if (day === 0 || day === 6) return time >= 18 * 60 + 30 && time <= 22 * 60 + 30
  return (time >= 11 * 60 + 30 && time <= 13 * 60 + 30) || (time >= 18 * 60 + 30 && time <= 22 * 60)
}

export default function Hours() {
  const open = isOpenNow()

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Infos pratiques</h2>
          <Badge variant={open ? 'green' : 'default'} className="text-sm px-4 py-1">
            {open ? '● Ouvert maintenant' : '● Fermé actuellement'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">Horaires</h3>
              </div>
              <div className="space-y-2">
                {RESTAURANT_INFO.hours.map(h => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-gray-500">{h.day}</span>
                    <span className={`font-medium ${h.open === false ? 'text-red-500' : 'text-gray-800'}`}>
                      {h.open === false ? 'Fermé' : h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">Adresse</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{RESTAURANT_INFO.address}</p>
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-600 hover:underline font-medium"
              >
                Voir sur Google Maps →
              </a>
            </CardContent>
          </Card>

          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">Nous contacter</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">Téléphone</p>
              <a href={`tel:${RESTAURANT_INFO.phone}`} className="text-lg font-semibold text-gray-900 hover:text-red-600">
                {RESTAURANT_INFO.phone}
              </a>
              <p className="text-sm text-gray-500 mt-4 mb-1">Email</p>
              <a href={`mailto:${RESTAURANT_INFO.email}`} className="text-sm text-red-600 hover:underline">
                {RESTAURANT_INFO.email}
              </a>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Livraison via</p>
                <p className="text-sm font-medium text-gray-700">Uber Eats 🛵</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
