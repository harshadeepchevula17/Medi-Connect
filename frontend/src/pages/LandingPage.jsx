import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import Hero from '../components/sections/Hero'
import Emergency from '../components/sections/Emergency'
import Footer from '../components/sections/Footer'

const valueProps = [
  { title: 'Top Quality Physicians', desc: 'Board-certified professionals delivering reliable urgent care.' },
  { title: 'Affordability', desc: 'Transparent pricing and flexible options for every patient.' },
  { title: 'Short Wait Times', desc: 'Reserve your slot and reduce waiting-room delays.' },
  { title: 'Convenience', desc: 'In-person and virtual access when and where you need it.' },
]

const serviceCards = [
  { icon: '💻', title: 'Virtual Care', desc: 'Consult online with licensed providers from home.' },
  { icon: '🧪', title: 'Testing & Labs', desc: 'Rapid diagnostics with clear same-day guidance.' },
  { icon: '🤒', title: 'Illness & Injuries', desc: 'Fast treatment for common non-emergency conditions.' },
  { icon: '🧒', title: 'Pediatrics', desc: 'Compassionate urgent care for infants, kids, and teens.' },
  { icon: '🛡️', title: 'Vaccinations', desc: 'Preventive protection for seasonal and travel needs.' },
  { icon: '🩺', title: 'Physicals', desc: 'School, sports, and occupational health clearances.' },
]

const patientVoices = [
  {
    quote: 'The whole experience was better than an ER visit. Fast, clear, and compassionate.',
    author: 'Margaret W.',
  },
  {
    quote: 'The doctor was understanding and thorough. I felt cared for from start to finish.',
    author: 'Joshua R.',
  },
  {
    quote: 'Excellent staff, smooth check-in, and the AI assistant made follow-up easy.',
    author: 'Ariana P.',
  },
]

const healthResources = [
  {
    category: 'Conditions',
    title: 'Recognizing early symptoms before they escalate',
  },
  {
    category: 'Urgent Care',
    title: 'When to choose urgent care instead of emergency rooms',
  },
  {
    category: 'Prevention',
    title: 'Simple habits for year-round family health',
  },
]

export default function LandingPage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location])

  return (
    <main className="bg-white text-text-primary">
      <Navbar />
      <Hero />

      <section className="py-10 border-y border-blue-100 bg-blue-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center text-center">
            {['medi-connect AI', 'Virtual Care+', 'Rapid Labs', 'Family Primary', 'Partner Network'].map((name) => (
              <div key={name} className="py-3 rounded-xl border border-blue-200 bg-white text-sm font-semibold text-text-secondary shadow-sm">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="py-24 bg-blue-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Quality Urgent Care the Moment You Need It</h2>
            <p className="text-text-tertiary max-w-2xl mx-auto">Our clinics and virtual team deliver timely care designed for modern healthcare journeys.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueProps.map((item) => (
              <div key={item.title} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_14px_36px_rgba(37,99,235,0.06)]">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">✓</div>
                <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-tertiary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="doctors" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">In-Person &amp; Virtual Care</h2>
            <p className="text-text-tertiary mb-8 leading-relaxed">Check in online, skip lines, and connect to a provider quickly. Whether in clinic or at home, your care path stays seamless.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all">In-Person Care</Link>
              <Link to="/login" className="px-6 py-3 rounded-xl border border-blue-200 text-text-primary font-semibold hover:bg-blue-50 transition-colors">Virtual Care</Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] border border-blue-100 bg-white shadow-[0_24px_64px_rgba(37,99,235,0.08)] p-7">
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 mb-4">
                <div className="text-xs uppercase tracking-[0.15em] text-text-tertiary mb-2">Today</div>
                <div className="text-xl font-semibold">Average wait: 7 minutes</div>
              </div>
              <div className="space-y-3">
                {['Online check-in', 'Digital intake', 'Provider consultation', 'Follow-up guidance'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 rounded-xl border border-blue-100 p-3 bg-white">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</div>
                    <span className="text-sm text-text-secondary">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="analytics" className="py-24 bg-blue-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Urgent Care Services</h2>
            <p className="text-text-tertiary max-w-2xl mx-auto">A complete portfolio for everyday urgent needs, available across locations and telehealth.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceCards.map((svc) => (
              <div key={svc.title} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_12px_30px_rgba(37,99,235,0.05)]">
                <div className="text-2xl mb-3">{svc.icon}</div>
                <h3 className="font-semibold text-text-primary mb-2">{svc.title}</h3>
                <p className="text-sm text-text-tertiary">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">See What Our Patients Are Saying</h2>
            <p className="text-text-tertiary">Real experiences from people who trusted medi-connect with their care.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {patientVoices.map((voice) => (
              <div key={voice.author} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_12px_28px_rgba(37,99,235,0.05)]">
                <p className="text-text-secondary leading-relaxed mb-5">"{voice.quote}"</p>
                <div className="text-sm font-semibold text-text-primary">{voice.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-blue-50/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">Year-Round Health Resources</h2>
              <p className="text-text-tertiary">Educational guides to help patients stay healthy every season.</p>
            </div>
            <a href="#" className="text-primary font-semibold hover:text-primary-dark transition-colors">See All Health Resources →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {healthResources.map((resource) => (
              <div key={resource.title} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_12px_28px_rgba(37,99,235,0.05)]">
                <div className="text-xs uppercase tracking-[0.14em] text-primary mb-3">{resource.category}</div>
                <h3 className="font-semibold text-text-primary leading-relaxed">{resource.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Emergency />
      <Footer />
    </main>
  )
}
