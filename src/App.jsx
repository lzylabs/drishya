import { Suspense, lazy, useEffect } from 'react'
import useStore from './store/useStore.js'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import HeroSection from './components/hero/HeroSection.jsx'
import WhatsAppButton from './components/ui/WhatsAppButton.jsx'

const Services      = lazy(() => import('./components/sections/Services.jsx'))
const Gallery       = lazy(() => import('./components/sections/Gallery.jsx'))
const Process       = lazy(() => import('./components/sections/Process.jsx'))
const Pricing       = lazy(() => import('./components/sections/Pricing.jsx'))
const Testimonials  = lazy(() => import('./components/sections/Testimonials.jsx'))
const FAQ           = lazy(() => import('./components/sections/FAQ.jsx'))
const Contact       = lazy(() => import('./components/sections/Contact.jsx'))

function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-4 h-4 rounded-full border border-[var(--line-2)] border-t-[var(--text-2)] animate-spin" />
    </div>
  )
}

export default function App() {
  const { theme } = useStore()

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
  }, [theme])

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={<Loader />}>
          <Services />
          <Gallery />
          <Process />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
