import { useState } from 'react'
import { Star, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RESTAURANT_INFO } from '@/data/menu'

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJ_4LDU1OE5UcRJJuqN5RWnAs'

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-9 h-9 transition-colors ${n <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
          />
        </button>
      ))}
    </div>
  )
}

export default function ReviewForm() {
  const [step, setStep] = useState('form') // 'form' | 'thanks-private' | 'thanks-google'
  const [rating, setRating] = useState(0)
  const [form, setForm] = useState({ name: '', comment: '' })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState([])

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (rating === 0) return setError('Veuillez sélectionner une note.')
    if (!form.name.trim()) return setError('Veuillez indiquer votre prénom.')
    setError('')

    if (rating <= 3) {
      // Enregistrement local discret
      setSaved(prev => [...prev, { ...form, rating, date: new Date().toLocaleDateString('fr-FR') }])
      setStep('thanks-private')
    } else {
      // Redirection Google
      setStep('thanks-google')
      setTimeout(() => window.open(GOOGLE_REVIEW_URL, '_blank'), 1800)
    }
  }

  const reset = () => {
    setStep('form')
    setRating(0)
    setForm({ name: '', comment: '' })
  }

  if (step === 'thanks-private') {
    return (
      <div className="text-center py-10 max-w-sm mx-auto">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre retour !</h3>
        <p className="text-gray-500 text-sm mb-6">
          Votre avis a été transmis à notre équipe. Nous prenons vos remarques très au sérieux pour nous améliorer.
        </p>
        <Button onClick={reset} variant="outline">Laisser un autre avis</Button>
      </div>
    )
  }

  if (step === 'thanks-google') {
    return (
      <div className="text-center py-10 max-w-sm mx-auto">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Super, merci ! 🎉</h3>
        <p className="text-gray-500 text-sm mb-4">
          Vous allez être redirigé vers Google pour publier votre avis…
        </p>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Ouvrir Google si non redirigé
          </Button>
        </a>
        <div className="mt-4">
          <Button onClick={reset} variant="ghost" size="sm">Retour</Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-gray-100 shadow-sm max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-gray-900">Votre expérience chez La Pizz à Papa</CardTitle>
        <p className="text-sm text-gray-500">Votre avis nous aide à nous améliorer.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label>Votre note *</Label>
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="text-sm text-gray-500">
                {rating === 1 && 'Très déçu(e)'}
                {rating === 2 && 'Pas satisfait(e)'}
                {rating === 3 && 'Correct'}
                {rating === 4 && 'Très bien !'}
                {rating === 5 && 'Excellent ! 🍕'}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Prénom *</Label>
            <Input id="name" name="name" placeholder="Votre prénom" value={form.name} onChange={handle} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="comment">Commentaire <span className="text-gray-400">(optionnel)</span></Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Partagez votre expérience : accueil, pizzas, service..."
              rows={4}
              value={form.comment}
              onChange={handle}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" size="lg">
            Envoyer mon avis
          </Button>

          <p className="text-xs text-center text-gray-400">
            {rating >= 4
              ? 'Votre avis sera publié sur Google pour aider d\'autres clients.'
              : 'Votre avis sera transmis directement à notre équipe.'}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
