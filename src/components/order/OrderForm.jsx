import { useState } from 'react'
import { Clock, Bike } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PICKUP_SLOTS, SIZES, DELIVERY } from '@/data/menu'

export default function OrderForm({ items, total, onConfirm, onBack, deliveryEnabled }) {
  const [orderType, setOrderType] = useState('pickup')
  const [form, setForm] = useState({ name: '', phone: '', slot: '', address: '' })
  const [errors, setErrors] = useState({})

  const deliveryFee = orderType === 'delivery' ? DELIVERY.fee : 0
  const grandTotal = total + deliveryFee

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Votre prénom est requis'
    if (!form.phone.match(/^[0-9\s+]{8,}$/)) e.phone = 'Numéro invalide'
    if (!form.slot) e.slot = 'Choisissez un horaire'
    if (orderType === 'delivery') {
      if (!form.address.trim()) e.address = 'Adresse de livraison requise'
      if (total < DELIVERY.minOrder) e.minOrder = `Commande minimum ${DELIVERY.minOrder.toFixed(2)} € pour la livraison`
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (validate()) onConfirm({ ...form, orderType, deliveryFee, grandTotal })
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="w-5 h-5 text-red-600" />
            Finalisez votre commande
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sélection pickup / livraison */}
          {deliveryEnabled && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-colors ${
                  orderType === 'pickup' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Clock className={`w-5 h-5 ${orderType === 'pickup' ? 'text-red-600' : 'text-gray-400'}`} />
                <span className="font-semibold text-sm">Click &amp; Collect</span>
                <span className="text-xs text-gray-500">Retrait sur place</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-colors ${
                  orderType === 'delivery' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Bike className={`w-5 h-5 ${orderType === 'delivery' ? 'text-red-600' : 'text-gray-400'}`} />
                <span className="font-semibold text-sm">Livraison</span>
                <span className="text-xs text-gray-500">+{DELIVERY.fee.toFixed(2)} €</span>
              </button>
            </div>
          )}

          {errors.minOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
              {errors.minOrder}
            </div>
          )}

          {/* Récap commande */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Récapitulatif</p>
            {items.map(item => (
              <div key={item.key} className="flex justify-between text-sm py-1">
                <span className="text-gray-600">
                  {item.qty}× {item.pizza.name}{' '}
                  <span className="text-gray-400">({SIZES[item.size].label})</span>
                </span>
                <span className="font-medium">{(SIZES[item.size].price * item.qty).toFixed(2)} €</span>
              </div>
            ))}
            {orderType === 'delivery' && (
              <div className="flex justify-between text-sm py-1 text-gray-600">
                <span>Frais de livraison</span>
                <span>{DELIVERY.fee.toFixed(2)} €</span>
              </div>
            )}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-red-600">{grandTotal.toFixed(2)} €</span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Prénom / Nom</Label>
              <Input id="name" name="name" placeholder="Jean Dupont" value={form.name} onChange={handle} />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={handle} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            {orderType === 'delivery' && (
              <div className="space-y-1.5">
                <Label htmlFor="address">Adresse de livraison</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="12 rue des Fleurs, Bourges"
                  value={form.address}
                  onChange={handle}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="slot">
                {orderType === 'delivery' ? 'Heure de livraison souhaitée' : 'Heure de retrait'}
              </Label>
              <select
                id="slot"
                name="slot"
                value={form.slot}
                onChange={handle}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <option value="">-- Choisir un créneau --</option>
                {PICKUP_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.slot && <p className="text-xs text-red-500">{errors.slot}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                ← Retour
              </Button>
              <Button type="submit" className="flex-1">
                Confirmer la commande
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
