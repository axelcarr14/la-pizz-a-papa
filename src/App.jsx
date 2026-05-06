import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Home from '@/pages/Home'
import Menu from '@/pages/Menu'
import Avis from '@/pages/Avis'
import { useCart } from '@/hooks/useCart'

export default function App() {
  const cart = useCart()

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar cartCount={cart.count} />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu cart={cart} />} />
            <Route path="/avis" element={<Avis />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
