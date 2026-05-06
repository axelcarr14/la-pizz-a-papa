import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SIZES } from '@/data/menu'

export default function PizzaCard({ pizza, onAdd }) {
  return (
    <Card className="border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
      {pizza.image && (
        <div className="w-full h-44 overflow-hidden bg-gray-100">
          <img
            src={pizza.image}
            alt={pizza.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardContent className="p-5">
        {!pizza.image && <div className="text-4xl mb-3">{pizza.emoji}</div>}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900">{pizza.name}</h3>
          <Badge variant="secondary" className="shrink-0 capitalize">{pizza.category}</Badge>
        </div>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{pizza.description}</p>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SIZES).map(([key, size]) => (
            <button
              key={key}
              onClick={() => onAdd(pizza, key)}
              className="group flex flex-col items-center border border-gray-200 rounded-lg p-2.5 hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <span className="text-xs text-gray-500 group-hover:text-red-600">{size.label}</span>
              <span className="text-xs text-gray-400">{size.diameter}</span>
              <span className="font-bold text-gray-900 mt-1 group-hover:text-red-600">
                {size.price.toFixed(2)} €
              </span>
              <Plus className="w-3.5 h-3.5 mt-1 text-gray-400 group-hover:text-red-500" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
