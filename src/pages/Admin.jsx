import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus'
import { Link } from 'react-router-dom'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234'

function statusLabel(s) {
  if (s === 'new') return { label: 'Nouvelle', cls: 'bg-red-100 text-red-700' }
  if (s === 'preparing') return { label: 'En préparation', cls: 'bg-amber-100 text-amber-700' }
  return { label: 'Prête', cls: 'bg-green-100 text-green-700' }
}

export default function Admin() {
  const [pin, setPin] = useState('')
  const [auth, setAuth] = useState(() => sessionStorage.getItem('admin_auth') === 'true')
  const [pinError, setPinError] = useState('')
  const [orders, setOrders] = useState([])
  const { enabled, loading, toggle } = useDeliveryStatus()

  const handlePin = (e) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuth(true)
    } else {
      setPinError('Code incorrect')
      setPin('')
    }
  }

  useEffect(() => {
    if (!auth) return
    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('orders')
      .select('*')
      .gte('created_at', today + 'T00:00:00')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []))

    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        supabase
          .from('orders')
          .select('*')
          .gte('created_at', today + 'T00:00:00')
          .order('created_at', { ascending: false })
          .then(({ data }) => setOrders(data || []))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [auth])

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border max-w-sm w-full">
          <div className="text-center mb-6">
            <img src="/logo.svg" alt="La Pizz à Papa" className="h-14 w-auto mx-auto mb-2" />
            <p className="text-sm text-gray-500">Administration</p>
          </div>
          <form onSubmit={handlePin} className="space-y-4">
            <input
              type="password"
              placeholder="Code PIN"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError('') }}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500"
              maxLength={6}
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm text-center">{pinError}</p>}
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium transition-colors">
              Connexion
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h1 className="text-xl font-bold">Administration</h1>
            <p className="text-sm text-gray-500">La Pizz à Papa</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/cuisine" className="text-sm text-gray-600 hover:text-red-600 underline">
              Écran cuisine →
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem('admin_auth'); setAuth(false) }}
              className="text-sm text-gray-400 hover:text-red-500"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Toggle livraison */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Livraison à domicile</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {loading ? 'Chargement…' : enabled
                  ? '✅ Activée — les clients peuvent choisir la livraison'
                  : '⛔ Désactivée — click & collect uniquement'}
              </p>
            </div>
            <button
              onClick={() => toggle(!enabled)}
              disabled={loading}
              aria-label="Toggle livraison"
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                enabled ? 'bg-green-500' : 'bg-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${enabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Commandes du jour */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">
            Commandes du jour{' '}
            <span className="text-gray-400 font-normal text-base">({orders.length})</span>
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">Aucune commande aujourd'hui</p>
          ) : (
            <div className="space-y-3">
              {orders.map(o => {
                const { label, cls } = statusLabel(o.status)
                const time = new Date(o.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={o.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{o.customer_name} — {o.phone}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {o.order_type === 'delivery'
                            ? `🚴 Livraison · ${o.address}`
                            : '🏠 Click & Collect'}
                          {' · '}{o.slot}
                        </p>
                        <ul className="text-sm text-gray-700 mt-2 space-y-0.5">
                          {(o.items || []).map((item, i) => (
                            <li key={i}>{item.qty}× {item.name}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-red-600">{Number(o.total).toFixed(2)} €</p>
                        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
