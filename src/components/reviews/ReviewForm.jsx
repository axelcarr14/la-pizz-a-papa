import { useState } from 'react'
import { Star, ExternalLink, CheckCircle, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RESTAURANT_INFO } from '@/data/menu'

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-150 hover:scale-125 focus:outline-none"
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
        >
          <Star
            className={`w-12 h-12 transition-colors duration-150 ${
              n <= active ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

const LABEL = ['', 'Très déçu(e)', 'Pas satisfait(e)', 'Correct', 'Très bien !', 'Excellent ! 🍕']

export default function ReviewForm() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const phase =
    rating === 0 ? 'idle'
    : rating >= 4  ? 'positive'
    : 'negative'

  const handleStars = (n) => {
    setRating(n)
    setSent(false)
    setComment('')
  }

  const sendPrivate = () => {
    const subject = encodeURIComponent(`Avis client – ${rating} étoile${rating > 1 ? 's' : ''}`)
    const body = encodeURIComponent(comment.trim() || '(Aucun commentaire laissé)')
    window.location.href = `mailto:${RESTAURANT_INFO.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const reset = () => {
    setRating(0)
    setComment('')
    setSent(false)
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-8">

      {/* Sélecteur d'étoiles */}
      <div className="space-y-3">
        <p className="text-gray-700 font-medium text-lg">
          {rating === 0 ? 'Quelle note donnez-vous ?' : LABEL[rating]}
        </p>
        <StarRating value={rating} onChange={handleStars} />
        {rating === 0 && (
          <p className="text-sm text-gray-400">Cliquez sur une étoile pour commencer</p>
        )}
      </div>

      {/* === RÉSULTAT POSITIF : 4-5 étoiles === */}
      {phase === 'positive' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            Merci ! Partagez votre enthousiasme sur Google !
          </p>
          <p className="text-sm text-gray-500">
            Votre avis aide d'autres clients à nous découvrir. Ça compte énormément pour nous.
          </p>
          <a
            href={RESTAURANT_INFO.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <button className="w-full h-12 px-6 rounded-md font-bold text-gray-900 bg-amber-400 hover:bg-amber-500 transition-colors duration-150 flex items-center justify-center gap-2 text-base">
              <ExternalLink className="w-4 h-4" />
              Laisser un avis sur Google
            </button>
          </a>
          <button
            onClick={reset}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Recommencer
          </button>
        </div>
      )}

      {/* === RÉSULTAT NÉGATIF : 1-3 étoiles === */}
      {phase === 'negative' && !sent && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4 text-left">
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-gray-900">Nous sommes désolés.</p>
            <p className="text-sm text-gray-500">
              Dites-nous ce qui n'a pas été pour que le patron puisse vous recontacter.
            </p>
          </div>
          <Textarea
            placeholder="Décrivez votre expérience : accueil, pizzas, délai, service..."
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
          />
          <Button
            onClick={sendPrivate}
            size="lg"
            className="w-full"
          >
            Envoyer mon retour en privé
          </Button>
          <p className="text-xs text-center text-gray-400">
            Votre message arrive directement dans la boîte mail du patron, sans publication publique.
          </p>
        </div>
      )}

      {/* === CONFIRMATION APRÈS ENVOI === */}
      {phase === 'negative' && sent && (
        <div className="space-y-4 py-4">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">Message transmis !</p>
          <p className="text-sm text-gray-500">
            Le patron en prendra connaissance et reviendra vers vous dans les plus brefs délais.
          </p>
          <button
            onClick={reset}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Laisser un autre avis
          </button>
        </div>
      )}

    </div>
  )
}
