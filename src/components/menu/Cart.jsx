import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SIZES } from '@/data/menu'

export default function Cart({ items, onUpdate, onRemove, onCheckout, total }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Votre panier est vide</p>
        <p className="text-xs mt-1">Ajoutez une pizza pour commencer</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 overflow-y-auto">
        {items.map(item => {
          const size = SIZES[item.size]
          const price = size.price
          return (
            <div key={item.key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{item.pizza.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{item.pizza.name}</p>
                <p className="text-xs text-gray-500">{size.label} – {size.diameter}</p>
                <p className="text-sm font-semibold text-red-600 mt-0.5">{(price * item.qty).toFixed(2)} €</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => onRemove(item.key)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => onUpdate(item.key, item.qty - 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-sm font-medium">{item.qty}</span>
                  <button onClick={() => onUpdate(item.key, item.qty + 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-700">Sous-total</span>
          <span className="text-xl font-bold text-gray-900">{total.toFixed(2)} €</span>
        </div>
        <Button onClick={onCheckout} className="w-full" size="lg">
          Commander – {total.toFixed(2)} €
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">Click &amp; Collect ou Livraison</p>
      </div>
    </div>
  )
}
