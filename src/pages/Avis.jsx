import ReviewForm from '@/components/reviews/ReviewForm'
import { Shield } from 'lucide-react'

export default function Avis() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Votre avis compte</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Nous lisons chaque avis. Il nous aide à progresser et à partager notre passion avec encore plus de clients.
        </p>
      </div>

      <ReviewForm />

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
        <Shield className="w-3.5 h-3.5" />
        <span>Les avis négatifs restent confidentiels et sont transmis directement à notre équipe.</span>
      </div>
    </main>
  )
}
