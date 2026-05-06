import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Pizza, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Navbar({ cartCount }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/menu', label: 'Menu & Commander' },
    { to: '/avis', label: 'Laisser un avis' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
          <Pizza className="w-6 h-6" />
          <span>La Pizz à Papa</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${pathname === l.to ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/menu">
            <Button size="sm" className="relative">
              <ShoppingCart className="w-4 h-4" />
              Panier
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-sm font-medium ${pathname === l.to ? 'text-red-600' : 'text-gray-600'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
