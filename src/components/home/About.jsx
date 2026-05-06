import { Leaf, ChefHat, Clock, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  { icon: ChefHat, title: 'Pâte maison', desc: 'Préparée sur place chaque jour selon la tradition italienne.' },
  { icon: Leaf, title: 'Ingrédients frais', desc: '100% produits frais, sélectionnés avec soin pour chaque pizza.' },
  { icon: Truck, title: 'À emporter', desc: 'Commandez en ligne, récupérez quand vous voulez. Simple et rapide.' },
  { icon: Clock, title: 'Service rapide', desc: 'Votre pizza prête à l\'heure choisie, sans attente.' },
]

export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Notre philosophie</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Chez La Pizz à Papa, chaque pizza est une invitation au voyage. Des saveurs authentiques, une générosité italienne.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
