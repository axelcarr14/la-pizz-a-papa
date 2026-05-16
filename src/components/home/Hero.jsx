import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Star } from 'lucide-react'

const VIDEOS = [
  '/videos/petrissage.mp4',
  '/videos/dans-le-four.mp4',
  '/videos/cheese-pull.mp4',
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const videoRef = useRef(null)

  const handleEnded = () => {
    setCurrent(prev => (prev + 1) % VIDEOS.length)
  }

  return (
    <section className="relative h-[90vh] min-h-[560px] flex items-center justify-center overflow-hidden">
      {/* Vidéo de fond */}
      <video
        ref={videoRef}
        key={VIDEOS[current]}
        src={VIDEOS[current]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Contenu */}
      <div className="relative z-10 text-white text-center px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />)}
          <span className="ml-1">4.5/5 · 137 avis</span>
        </div>

        <img src="/logo.svg" alt="La Pizz à Papa" className="h-24 md:h-32 w-auto mx-auto mb-4 brightness-0 invert drop-shadow-xl" />

        <p className="text-xl md:text-2xl text-white/90 mb-2">
          Pizzas artisanales à Bourges
        </p>
        <p className="text-white/70 max-w-xl mx-auto mb-10">
          Pâte maison, ingrédients frais sélectionnés. Click &amp; Collect ou Livraison.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/menu">
            <Button size="lg" className="bg-white text-red-700 hover:bg-red-50 font-semibold shadow-lg">
              Voir le menu &amp; Commander
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/avis">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Laisser un avis
            </Button>
          </Link>
        </div>

        {/* Indicateurs vidéo */}
        <div className="flex justify-center gap-2 mt-10">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
