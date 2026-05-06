import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import Hours from '@/components/home/Hours'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { RESTAURANT_INFO } from '@/data/menu'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Hours />

      {/* CTA Avis */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-300 text-amber-300" />)}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Vous avez aimé votre pizza ?</h2>
          <p className="text-red-100 mb-6 max-w-md mx-auto">
            Partagez votre expérience ! Votre avis aide d'autres gourmets à nous découvrir.
          </p>
          <Link to="/avis">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-semibold">
              Laisser un avis
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
