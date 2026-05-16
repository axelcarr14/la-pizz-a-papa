import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { RESTAURANT_INFO } from '@/data/menu'

let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playAlert() {
  try {
    const ctx = getAudioCtx()
    const beep = (freq, start, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.4, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }
    beep(880, 0, 0.2)
    beep(1100, 0.25, 0.2)
    beep(880, 0.5, 0.4)
  } catch {}
}

function ticketHTML(order) {
  const time = new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const items = (order.items || [])
    .map(i => `<div class="row"><span>${i.qty}× ${i.name}</span><span>${(i.price * i.qty).toFixed(2)}€</span></div>`)
    .join('')
  const deliveryLine = order.order_type === 'delivery'
    ? `<div class="row"><span>Livraison</span><span>${Number(order.total - order.items.reduce((s, i) => s + i.price * i.qty, 0)).toFixed(2)}€</span></div>`
    : ''

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: monospace; font-size: 13px; width: 72mm; margin: 0 auto; padding: 6px; }
  .center { text-align: center; }
  .bold { font-weight: bold; font-size: 15px; }
  .dashes { border-top: 1px dashed #000; margin: 5px 0; }
  .row { display: flex; justify-content: space-between; margin: 2px 0; }
  .tag { display: inline-block; border: 1px solid #000; padding: 2px 6px; margin: 3px 0; }
</style>
</head><body>
  <div class="center bold">LA PIZZ À PAPA</div>
  <div class="center" style="font-size:11px">Bourges · ${RESTAURANT_INFO.phone}</div>
  <div class="dashes"></div>
  <div class="row">
    <span class="bold">${order.order_type === 'delivery' ? '🚴 LIVRAISON' : '🏠 CLICK & COLLECT'}</span>
    <span>${time}</span>
  </div>
  ${order.order_type === 'delivery' ? `<div style="font-size:12px">📍 ${order.address}</div>` : ''}
  <div>Client : <b>${order.customer_name}</b> · ${order.phone}</div>
  <div>Heure : <b>${order.slot}</b></div>
  <div class="dashes"></div>
  ${items}
  <div class="dashes"></div>
  ${deliveryLine}
  <div class="row bold"><span>TOTAL</span><span>${Number(order.total).toFixed(2)}€</span></div>
  <div class="dashes"></div>
  <div class="center" style="font-size:11px">Merci de votre commande !</div>
</body></html>`
}

function printOrder(order) {
  const win = window.open('', '_blank', 'width=320,height=500')
  if (!win) return
  win.document.write(ticketHTML(order))
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 300)
}

const STATUS_NEXT = { new: 'preparing', preparing: 'ready' }
const STATUS_LABEL = {
  new: { label: 'Nouvelle commande', btn: 'En préparation', cls: 'border-red-500 bg-red-950' },
  preparing: { label: 'En préparation', btn: 'Prête ✓', cls: 'border-amber-500 bg-amber-950' },
  ready: { label: 'Prête', btn: null, cls: 'border-green-600 bg-green-950 opacity-60' },
}

export default function Cuisine() {
  const [orders, setOrders] = useState([])
  const [autoPrint, setAutoPrint] = useState(true)
  const [clock, setClock] = useState(new Date())
  const [audioReady, setAudioReady] = useState(false)
  const autoPrintRef = useRef(true)
  const alertIntervalRef = useRef(null)

  const unlockAudio = () => {
    getAudioCtx()
    setAudioReady(true)
  }

  // Bip en boucle tant qu'il y a des commandes "new" non acquittées
  useEffect(() => {
    const hasNew = orders.some(o => o.status === 'new')
    if (hasNew && audioReady) {
      if (!alertIntervalRef.current) {
        playAlert()
        alertIntervalRef.current = setInterval(playAlert, 5000)
      }
    } else {
      clearInterval(alertIntervalRef.current)
      alertIntervalRef.current = null
    }
    return () => {}
  }, [orders, audioReady])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]

    supabase
      .from('orders')
      .select('*')
      .gte('created_at', today + 'T00:00:00')
      .not('status', 'eq', 'ready')
      .order('created_at', { ascending: true })
      .then(({ data }) => setOrders(data || []))

    const channel = supabase
      .channel('cuisine-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, ({ new: o }) => {
        setOrders(prev => [...prev, o])
        if (autoPrintRef.current) printOrder(o)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, ({ new: o }) => {
        setOrders(prev =>
          o.status === 'ready'
            ? prev.filter(x => x.id !== o.id)
            : prev.map(x => x.id === o.id ? o : x)
        )
      })
      .subscribe()

    const clockTimer = setInterval(() => setClock(new Date()), 1000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(clockTimer)
      clearInterval(alertIntervalRef.current)
    }
  }, [])

  const toggleAutoPrint = () => {
    const v = !autoPrint
    setAutoPrint(v)
    autoPrintRef.current = v
  }

  const advanceStatus = async (order) => {
    const next = STATUS_NEXT[order.status]
    if (!next) return
    await supabase.from('orders').update({ status: next }).eq('id', order.id)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="La Pizz à Papa" className="h-10 w-auto brightness-0 invert" />
          <p className="text-gray-400 text-sm">Écran cuisine</p>
        </div>

        <div className="flex items-center gap-4">
          {!audioReady ? (
            <button
              onClick={unlockAudio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-red-500 text-red-400 animate-pulse"
            >
              🔔 Activer le son
            </button>
          ) : (
            <button
              onClick={playAlert}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-gray-600 text-gray-400"
            >
              🔔 Test son
            </button>
          )}
          <button
            onClick={toggleAutoPrint}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              autoPrint ? 'border-green-500 text-green-400' : 'border-gray-600 text-gray-400'
            }`}
          >
            🖨️ {autoPrint ? 'Impression auto ON' : 'Impression auto OFF'}
          </button>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold">
              {clock.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-500">
              {clock.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Commandes */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <p className="text-5xl mb-4">✓</p>
          <p className="text-xl font-medium">Aucune commande en cours</p>
          <p className="text-sm mt-1">Les nouvelles commandes apparaîtront ici automatiquement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map(o => {
            const st = STATUS_LABEL[o.status] || STATUS_LABEL.new
            const time = new Date(o.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            return (
              <div key={o.id} className={`border-2 rounded-xl p-5 flex flex-col gap-3 ${st.cls}`}>
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${
                      o.status === 'new' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {st.label}
                    </span>
                    <p className="font-bold text-xl">{o.customer_name}</p>
                    <p className="text-gray-300 text-sm">{o.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{time}</p>
                    <p className="font-bold text-lg mt-1">{Number(o.total).toFixed(2)} €</p>
                  </div>
                </div>

                {/* Type */}
                <div className={`rounded-lg p-2 text-sm font-medium ${
                  o.order_type === 'delivery' ? 'bg-blue-900 text-blue-200' : 'bg-gray-800 text-gray-200'
                }`}>
                  {o.order_type === 'delivery'
                    ? `🚴 LIVRAISON · ${o.slot} · ${o.address}`
                    : `🏠 CLICK & COLLECT · ${o.slot}`}
                </div>

                {/* Items */}
                <div className="space-y-1">
                  {(o.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-base">
                      <span><span className="font-bold text-lg">{item.qty}×</span> {item.name}</span>
                      <span className="text-gray-400 text-sm">{item.size === 'papa' ? '33cm' : ''}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => printOrder(o)}
                    className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-400 text-sm transition-colors"
                  >
                    🖨️ Imprimer
                  </button>
                  {st.btn && (
                    <button
                      onClick={() => advanceStatus(o)}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                        o.status === 'new'
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-green-600 hover:bg-green-500 text-white'
                      }`}
                    >
                      {st.btn}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
