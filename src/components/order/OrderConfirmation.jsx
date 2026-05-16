import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { RESTAURANT_INFO } from '@/data/menu'

export default function OrderConfirmation({ order, onReset }) {
  const isDelivery = order.orderType === 'delivery'

  return (
    <div className="max-w-md mx-auto text-center py-12 px-4">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande enregistrée !</h2>
      <p className="text-gray-500 mb-6">
        Merci <strong>{order.name}</strong> !{' '}
        {isDelivery
          ? <>Votre commande sera livrée vers <strong>{order.slot}</strong>.</>
          : <>Votre commande sera prête à <strong>{order.slot}</strong>.</>
        }
      </p>

      {isDelivery ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm font-medium text-blue-800 mb-1">🚴 Livraison à domicile</p>
          <p className="text-sm text-blue-700">{order.address}</p>
          <p className="text-sm text-blue-700 mt-2">
            En cas de problème, appelez-nous :&nbsp;
            <a href={`tel:${RESTAURANT_INFO.phone}`} className="font-semibold hover:underline">
              {RESTAURANT_INFO.phone}
            </a>
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm font-medium text-amber-800 mb-1">📍 Retrait sur place</p>
          <p className="text-sm text-amber-700">{RESTAURANT_INFO.address}</p>
          <p className="text-sm text-amber-700 mt-2">
            En cas de problème, appelez-nous :&nbsp;
            <a href={`tel:${RESTAURANT_INFO.phone}`} className="font-semibold hover:underline">
              {RESTAURANT_INFO.phone}
            </a>
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button onClick={onReset} variant="outline">
          Passer une nouvelle commande
        </Button>
        <Link to="/">
          <Button variant="ghost" className="w-full">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  )
}
