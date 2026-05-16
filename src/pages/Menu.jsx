import { useState } from 'react'
import { ShoppingCart, SlidersHorizontal } from 'lucide-react'
import PizzaCard from '@/components/menu/PizzaCard'
import Cart from '@/components/menu/Cart'
import OrderForm from '@/components/order/OrderForm'
import OrderConfirmation from '@/components/order/OrderConfirmation'
import { Badge } from '@/components/ui/badge'
import { MENU, CATEGORIES, SIZES } from '@/data/menu'
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus'
import { supabase } from '@/lib/supabase'

export default function Menu({ cart }) {
  const { items, addItem, removeItem, updateQty, clearCart, total, count } = cart
  const [category, setCategory] = useState('tous')
  const [step, setStep] = useState('menu') // 'menu' | 'checkout' | 'confirmed'
  const [order, setOrder] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const { enabled: deliveryEnabled } = useDeliveryStatus()

  const filtered = category === 'tous' ? MENU : MENU.filter(p => p.category === category)

  const handleAdd = (pizza, size) => {
    addItem(pizza, size)
    setCartOpen(true)
  }

  const handleConfirm = async (form) => {
    const { error } = await supabase.from('orders').insert({
      customer_name: form.name,
      phone: form.phone,
      order_type: form.orderType,
      address: form.address || null,
      slot: form.slot,
      items: items.map(i => ({
        name: i.pizza.name,
        size: i.size,
        qty: i.qty,
        price: SIZES[i.size].price,
      })),
      total: form.grandTotal,
      status: 'new',
    })
    if (error) { console.error('Supabase error:', error); return }
    setOrder(form)
    clearCart()
    setStep('confirmed')
  }

  const handleReset = () => {
    setStep('menu')
    setOrder(null)
    setCartOpen(false)
  }

  if (step === 'confirmed') {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <OrderConfirmation order={order} onReset={handleReset} />
      </main>
    )
  }

  if (step === 'checkout') {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <OrderForm
          items={items}
          total={total}
          deliveryEnabled={deliveryEnabled}
          onConfirm={handleConfirm}
          onBack={() => setStep('menu')}
        />
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Notre Menu</h1>
        <p className="text-gray-500">Papa 33 cm – <strong>14,50 €</strong></p>
      </div>

      <div className="flex gap-8">
        {/* Grille pizzas */}
        <div className="flex-1 min-w-0">
          {/* Filtres */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(pizza => (
              <PizzaCard key={pizza.id} pizza={pizza} onAdd={handleAdd} />
            ))}
          </div>
        </div>

        {/* Panier desktop */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24 border border-gray-100 rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Panier
              </h2>
              {count > 0 && (
                <Badge>{count} article{count > 1 ? 's' : ''}</Badge>
              )}
            </div>
            <Cart
              items={items}
              total={total}
              onUpdate={updateQty}
              onRemove={removeItem}
              onCheckout={() => setStep('checkout')}
            />
          </div>
        </aside>
      </div>

      {/* Panier mobile flottant */}
      {count > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="w-full bg-red-600 text-white rounded-xl py-3 px-5 flex items-center justify-between shadow-xl"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">{count} article{count > 1 ? 's' : ''}</span>
            </span>
            <span className="font-bold">{total.toFixed(2)} €</span>
          </button>

          {cartOpen && (
            <div className="mt-2 bg-white border border-gray-100 rounded-xl p-5 shadow-xl max-h-96 overflow-y-auto">
              <Cart
                items={items}
                total={total}
                onUpdate={updateQty}
                onRemove={removeItem}
                onCheckout={() => { setCartOpen(false); setStep('checkout') }}
              />
            </div>
          )}
        </div>
      )}
    </main>
  )
}
