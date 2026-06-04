import { useEffect, useRef, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Hero from '../components/sections/Hero'
import NavBar from '../components/ui/Navbar'
import Emergency from '../components/sections/Emergency'
import Footer from '../components/sections/Footer'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const valueProps = [
  {
    title: 'Top Quality Physicians',
    desc: 'Board-certified professionals delivering reliable, expert urgent care you can count on.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing',
    desc: 'No surprise bills. Clear, upfront costs with flexible payment options for every patient.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    title: 'Short Wait Times',
    desc: 'Reserve your slot online and step into care — no crowded waiting rooms, no wasted hours.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Always Accessible',
    desc: 'In-person clinics and virtual care available morning to night, seven days a week.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-6 3h.008v.008H6v-.008Zm3 0h.008v.008H9v-.008Z" />
      </svg>
    ),
  },
]

const serviceCards = [
  {
    title: 'Smart Appointment Booking',
    step: '01',
    desc: 'Book appointments instantly with real-time doctor availability.',
    accent: '#8a6e30',
    accentLight: 'rgba(138,110,48,0.1)',
    borderAccent: 'rgba(138,110,48,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" />
      </svg>
    ),
  },
  {
    title: 'AI Symptom Analysis',
    step: '02',
    desc: 'Describe symptoms and receive AI-powered preliminary insights.',
    accent: '#7c5c3a',
    accentLight: 'rgba(124,92,58,0.1)',
    borderAccent: 'rgba(124,92,58,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v6m0 8v6m6-12h-6m-8 0H6" />
      </svg>
    ),
  },
  {
    title: 'Doctor Connect',
    step: '03',
    desc: 'Consult verified healthcare professionals anytime.',
    accent: '#5c7a4a',
    accentLight: 'rgba(92,122,74,0.1)',
    borderAccent: 'rgba(92,122,74,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Digital Prescriptions',
    step: '04',
    desc: 'Receive and manage prescriptions securely from any device.',
    accent: '#8a6e30',
    accentLight: 'rgba(138,110,48,0.1)',
    borderAccent: 'rgba(138,110,48,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M7 4h10v4H7z" />
      </svg>
    ),
  },
  {
    title: 'Medical Records Hub',
    step: '05',
    desc: 'Access all healthcare records from one unified platform.',
    accent: '#7c5c3a',
    accentLight: 'rgba(124,92,58,0.1)',
    borderAccent: 'rgba(124,92,58,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 0 0 2 2h14V5H5a2 2 0 0 0-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Recovery Tracking',
    step: '06',
    desc: 'Monitor treatment progress with intelligent health analytics.',
    accent: '#5c7a4a',
    accentLight: 'rgba(92,122,74,0.1)',
    borderAccent: 'rgba(92,122,74,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3 8 4-16 3 6h4" />
      </svg>
    ),
  },
]

const faqItems = [
  { q: 'How do I book an appointment?', a: 'Use Smart Appointment Booking to pick a date, time, and available doctor in real time—no phone calls required.' },
  { q: 'Is the AI symptom analysis a diagnosis?', a: 'No—AI Symptom Analysis provides preliminary guidance only. Always consult a clinician for an official diagnosis.' },
  { q: 'When can I consult a doctor?', a: 'Doctor Connect gives access to verified clinicians across extended hours; availability shows during booking.' },
  { q: 'How are prescriptions delivered?', a: 'Digital Prescriptions are sent electronically to your chosen pharmacy and available in your account.' },
  { q: 'Where are my medical records stored?', a: 'Records are stored securely in the Medical Records Hub with encryption and access controls.' },
  { q: 'How does recovery tracking work?', a: 'Recovery Tracking aggregates visit notes, vitals, and patient-reported outcomes to show progress over time.' },
  { q: 'Do you accept insurance?', a: 'We accept many major insurers; pricing and coverage depend on your plan—check billing during checkout.' },
  { q: 'Can I share records with another provider?', a: 'Yes—you can export or grant temporary access to other providers from your records page.' },
  { q: 'Are virtual consults secure?', a: 'Yes—all telehealth sessions use end-to-end encrypted communication and protected storage.' },
  { q: 'How quickly will I get lab results?', a: 'Most routine labs return results same-day; you will be notified in-app when results are available.' },
  { q: 'What if I have an emergency?', a: 'If you are experiencing a medical emergency, call your local emergency number or go to the nearest ER.' },
  { q: 'How do I manage my account?', a: 'Visit Profile Settings to update personal info, payment methods, and communication preferences.' },
]

const patientVoices = [
  { quote: 'The whole experience was better than any ER visit I have had. Fast, clear, and genuinely compassionate from the moment I walked in.', author: 'Margaret Wilson', role: 'Patient since 2022', initials: 'MW', hue: '#e8f0ff' },
  { quote: 'The doctor was understanding and thorough. I felt genuinely cared for, not like just another appointment to get through.', author: 'Joshua Reynolds', role: 'Patient since 2021', initials: 'JR', hue: '#e8f9ee' },
  { quote: 'Smooth check-in, excellent staff, and the follow-up process was the easiest thing I have experienced in healthcare.', author: 'Ariana Patel', role: 'Patient since 2023', initials: 'AP', hue: '#fde8f5' },
  { quote: 'I was nervous bringing my daughter in but the pediatric team put us both completely at ease. We will always come back here.', author: 'David Nakamura', role: 'Patient since 2020', initials: 'DN', hue: '#fff8e8' },
  { quote: 'Virtual care was seamless from start to finish. Got a prescription within 30 minutes without ever leaving my house.', author: 'Sofia Okonkwo', role: 'Patient since 2023', initials: 'SO', hue: '#f3e8ff' },
  { quote: 'Lab results same day, staff explained everything clearly. This is what modern healthcare should feel like everywhere.', author: 'Robert Chen', role: 'Patient since 2022', initials: 'RC', hue: '#fff0e8' },
]

const healthResources = [
  { category: 'Conditions', title: 'Recognizing early warning signs before symptoms escalate', num: '01' },
  { category: 'Urgent Care', title: 'When to choose urgent care over the emergency room', num: '02' },
  { category: 'Prevention', title: 'Simple daily habits that protect your family year-round', num: '03' },
]

/* ─────────────────────────────────────────────
   HOOKS & HELPERS
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(36px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

function PillBadge({ children, color = '#c9a84c', bg = 'rgba(201,168,76,0.12)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 14px', borderRadius: 100,
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
      background: bg, color, border: `1px solid ${color}40`,
      marginBottom: 18,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {children}
    </span>
  )
}

function DiamondDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', margin: '0 auto 20px' }}>
      <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, #c9a84c66)' }} />
      <div style={{ width: 7, height: 7, background: '#c9a84c', transform: 'rotate(45deg)', flexShrink: 0 }} />
      <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, #c9a84c66)' }} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   AUTO-SCROLL CAROUSEL
───────────────────────────────────────────── */
function TestimonialCarousel() {
  const doubled = [...patientVoices, ...patientVoices]
  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to right, #0c1929, transparent)',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to left, #0c1929, transparent)',
      }} />
      <div
        style={{
          display: 'flex', gap: 20, width: 'max-content',
          animation: 'marquee 48s linear infinite',
          paddingBottom: 4,
        }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
      >
        {doubled.map((v, i) => (
          <div key={i} style={{
            width: 340, flexShrink: 0, borderRadius: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '28px 26px 22px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#c9a84c">
                  <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(226,232,240,0.88)', margin: '0 0 20px', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
              "{v.quote}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: v.hue, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, color: '#1a1a2e', fontFamily: "'Sora', sans-serif", flexShrink: 0,
              }}>{v.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{v.author}</div>
                <div style={{ fontSize: 11, color: '#c9a84c', marginTop: 1 }}>{v.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
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

  const [openFaq, setOpenFaq] = useState(null)
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  return (
    <>
      <NavBar />
      <Hero />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .font-display { font-family: 'Sora', sans-serif; }
        .font-serif   { font-family: 'Lora', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        .float { animation: float 6s ease-in-out infinite; }

        @keyframes shimmer-line {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .service-card {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
          cursor: default;
        }
        .service-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 32px 64px rgba(0,0,0,0.35) !important;
        }

        .val-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          cursor: default;
        }
        .val-card:hover {
          transform: translateY(-4px);
          border-color: rgba(201,168,76,0.4) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(201,168,76,0.15) !important;
        }

        .res-card {
          transition: all 0.35s ease;
          cursor: default;
        }
        .res-card:hover {
          transform: translateX(6px);
          border-left-color: #c9a84c !important;
        }
        .res-card:hover .res-num {
          color: #c9a84c !important;
        }

        /* Diagonal stripe texture overlay */
        .texture-overlay {
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.012) 0px,
            rgba(255,255,255,0.012) 1px,
            transparent 1px,
            transparent 8px
          );
        }

        /* Gold shimmer on hover */
        .gold-hover {
          position: relative; overflow: hidden;
        }
        .gold-hover::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.15) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0s;
        }
        .gold-hover:hover::after {
          transform: translateX(100%);
          transition: transform 0.6s ease;
        }

        /* Glowing CTA button */
        .btn-gold {
          background: linear-gradient(135deg, #c9a84c, #e8c96a, #c9a84c);
          background-size: 200% 100%;
          color: #1a1200;
          font-weight: 700;
          font-size: 13.5px;
          letter-spacing: 0.04em;
          padding: 14px 30px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: background-position 0.4s ease, box-shadow 0.3s ease, transform 0.2s ease;
          box-shadow: 0 4px 20px rgba(201,168,76,0.35);
          font-family: 'Sora', sans-serif;
        }
        .btn-gold:hover {
          background-position: 100% 0;
          box-shadow: 0 8px 32px rgba(201,168,76,0.55);
          transform: translateY(-2px);
        }

        .btn-outline {
          background: transparent;
          color: rgba(226,232,240,0.9);
          font-weight: 600;
          font-size: 13.5px;
          letter-spacing: 0.04em;
          padding: 13px 28px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          font-family: 'Sora', sans-serif;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.35);
          transform: translateY(-2px);
        }

        /* Section wave */
        .wave-sep { display: block; width: 100%; overflow: hidden; line-height: 0; }
      `}</style>

      <main className="font-body">

        {/* ────── TRUST BAR ────────────────────── */}
        <section style={{ background: '#f7f3ec', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '14px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'center', textAlign: 'center' }}>
              {['medi-connect AI', 'Virtual Care+', 'Rapid Labs', 'Family Primary', 'Partner Network'].map((name, i) => (
                <FadeUp key={name} delay={i * 70}>
                  <div style={{
                    fontSize: 11.5, fontWeight: 600, color: '#6b5d3f',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '8px 0',
                    borderRight: i < 4 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                  }}>
                    {name}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ────── VALUE PROPS ──────────────────── */}
        <section id="ai" style={{ background: '#f7f3ec', padding: '100px 0 110px', position: 'relative', overflow: 'hidden' }}>
          {/* subtle dot grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
          {/* warm radial glow */}
          <div style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
            top: -100, right: -100, pointerEvents: 'none', zIndex: 0,
          }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <FadeUp>
              <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <PillBadge color="#8a6e30" bg="rgba(201,168,76,0.12)">Why medi-connect</PillBadge>
                <DiamondDivider />
                <h2 className="font-display" style={{
                  fontSize: 52, fontWeight: 700, color: '#1a1200', lineHeight: 1.12,
                  marginBottom: 18, letterSpacing: '-0.02em',
                }}>
                  Quality Urgent Care<br />
                  <span style={{ color: '#8a6e30' }}>the Moment You Need It</span>
                </h2>
                <p style={{ maxWidth: 500, margin: '0 auto', fontSize: 16.5, color: '#5a4e38', lineHeight: 1.75, fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                  Our clinics and virtual team deliver timely, expert care designed for modern healthcare journeys.
                </p>
              </div>
            </FadeUp>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {valueProps.map((item, i) => (
                <FadeUp key={item.title} delay={i * 90}>
                  <div className="val-card gold-hover" style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 16, padding: '28px 24px',
                    height: '100%',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: '#f7f3ec', border: '1px solid rgba(201,168,76,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#8a6e30', marginBottom: 20,
                    }}>
                      {item.icon}
                    </div>
                    <h3 className="font-display" style={{ fontWeight: 600, fontSize: 15.5, color: '#1a1200', marginBottom: 10 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: '#6b5d3f', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* WAVE 1 */}
        <div className="wave-sep" style={{ background: '#f7f3ec', marginBottom: -2 }}>
          <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 90 }}>
            <path d="M0,30 C180,80 360,0 540,45 C720,90 900,15 1080,50 C1260,85 1380,20 1440,40 L1440,90 L0,90 Z" fill="#0c1929" />
          </svg>
        </div>

        {/* ────── IN-PERSON / VIRTUAL ──────────── */}
        <section id="doctors" className="texture-overlay" style={{
          background: '#0c1929', padding: '100px 0 110px', position: 'relative', overflow: 'hidden',
        }}>
          {/* circuit-like decorative lines */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
            <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.06 }} width="600" height="600" viewBox="0 0 600 600">
              <circle cx="500" cy="100" r="380" fill="none" stroke="#c9a84c" strokeWidth="1" />
              <circle cx="500" cy="100" r="280" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
              <circle cx="500" cy="100" r="200" fill="none" stroke="#c9a84c" strokeWidth="0.5" style={{ animation: 'slow-spin 30s linear infinite', transformOrigin: '500px 100px' }} />
            </svg>
          </div>

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

              {/* text side */}
              <FadeUp>
                <div>
                  <PillBadge color="#4caf82" bg="rgba(76,175,130,0.12)">Care on Your Terms</PillBadge>
                  <h2 className="font-display" style={{ fontSize: 46, fontWeight: 700, color: '#f0ece4', lineHeight: 1.12, marginBottom: 22, letterSpacing: '-0.02em' }}>
                    In-Person &amp; Virtual Care,<br />Seamlessly Unified
                  </h2>
                  <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(226,232,240,0.75)', marginBottom: 36, fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                    Check in online, skip the lines, and connect to a provider in minutes. Whether you visit a clinic or join from your couch, your care path stays effortless.
                  </p>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <Link to="/signup" className="btn-gold">In-Person Care →</Link>
                    <Link to="/login" className="btn-outline">Virtual Care</Link>
                  </div>

                  {/* stat row */}
                  <div style={{ display: 'flex', gap: 32, marginTop: 48, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {[{ n: '7 min', l: 'Average wait time' }, { n: '98%', l: 'Patient satisfaction' }, { n: '24/7', l: 'Virtual availability' }].map(s => (
                      <div key={s.l}>
                        <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#c9a84c', lineHeight: 1 }}>{s.n}</div>
                        <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.8)', marginTop: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* dashboard card */}
              <FadeUp delay={160}>
                <div className="float">
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 24, padding: 30,
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}>
                    {/* header chip */}
                    <div style={{
                      borderRadius: 12, padding: '16px 20px', marginBottom: 20,
                      background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                    }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#c9a84c', fontWeight: 700, marginBottom: 4 }}>Live Today</div>
                      <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#f0ece4' }}>
                        Average wait: <span style={{ color: '#4caf82' }}>7 minutes</span>
                      </div>
                    </div>
                    {/* steps */}
                    {['Online check-in', 'Digital intake form', 'Provider consultation', 'Follow-up & prescriptions'].map((step, i) => (
                      <div key={step} style={{
                        display: 'flex', alignItems: 'center', gap: 14, borderRadius: 10,
                        padding: '11px 14px', marginBottom: 8,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                          background: 'rgba(255,255,255,0.07)',
                          color: 'rgba(148,163,184,0.7)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}>{i + 1}</div>
                        <span style={{ fontSize: 13.5, color: 'rgba(226,232,240,0.9)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* WAVE 2 */}
        <div className="wave-sep" style={{ background: '#0c1929', marginBottom: -2 }}>
          <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 90 }}>
            <path d="M0,50 C200,10 400,80 600,40 C800,0 1000,70 1200,35 C1330,15 1400,60 1440,45 L1440,90 L0,90 Z" fill="#f7f3ec" />
          </svg>
        </div>

        {/* ────── SERVICES ─────────────────────── */}
        <section id="analytics" style={{ background: '#f7f3ec', padding: '100px 0 110px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
            bottom: -100, left: -100, pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <FadeUp>
              <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <PillBadge color="#8a6e30" bg="rgba(201,168,76,0.12)">Services</PillBadge>
                <DiamondDivider />
                <h2 className="font-display" style={{ fontSize: 52, fontWeight: 700, color: '#1a1200', lineHeight: 1.12, marginBottom: 16, letterSpacing: '-0.02em' }}>
                  Our Services
                </h2>
                <p style={{ maxWidth: 480, margin: '0 auto', fontSize: 16, color: '#5a4e38', lineHeight: 1.75, fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                  A complete portfolio for everyday urgent needs, available across all locations and telehealth.
                </p>
              </div>
            </FadeUp>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {serviceCards.map((svc, i) => (
                <FadeUp key={svc.title} delay={i * 70}>
                  <div className="service-card gold-hover" style={{
                    background: '#fff8ef', borderRadius: 18,
                    padding: '32px 28px', height: '100%',
                    boxShadow: '0 12px 36px rgba(71,45,20,0.12)',
                    border: svc.borderAccent ? `1px solid ${svc.borderAccent}` : '1px solid rgba(0,0,0,0.06)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* decorative corner circle */}
                    <div style={{
                      position: 'absolute', width: 120, height: 120, borderRadius: '50%',
                      background: svc.accent ? svc.accent + '22' : 'rgba(201,168,76,0.12)', top: -20, right: -20, pointerEvents: 'none',
                    }} />
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: svc.accent || '#c9a84c', marginBottom: 24,
                      boxShadow: `0 0 16px ${svc.accent || '#c9a84c'}`,
                    }} />
                    <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: '#2b1c13', marginBottom: 12, lineHeight: 1.3 }}>{svc.title}</h3>
                    <p style={{ fontSize: 14, color: '#4a3a2b', lineHeight: 1.7, margin: '0 0 24px' }}>{svc.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: svc.accent || '#6b4a2f', letterSpacing: '0.04em' }}>
                      <span>Learn more</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={svc.accent || '#6b4a2f'} strokeWidth="2.5">
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* WAVE 3 - layered top curves (max 3) */}
        <div className="wave-sep" style={{ background: '#f7f3ec', marginBottom: -2 }}>
          <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 90 }}>
            <path d="M0,48 C250,100 500,10 750,50 C1000,90 1200,20 1440,50 L1440,90 L0,90 Z" fill="#0c1929" fillOpacity="0.45" />
            <path d="M0,42 C300,95 600,5 900,55 C1100,90 1300,20 1440,45 L1440,90 L0,90 Z" fill="#0c1929" fillOpacity="0.75" />
            <path d="M0,36 C200,85 500,0 800,45 C1050,80 1250,10 1440,40 L1440,90 L0,90 Z" fill="#0c1929" />
          </svg>
        </div>

        {/* ────── TESTIMONIALS ─────────────────── */}
        <section id="dashboard" className="texture-overlay" style={{ background: '#0c1929', padding: '100px 0', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', marginBottom: 52, position: 'relative', zIndex: 1 }}>
            <FadeUp>
              <div style={{ textAlign: 'center' }}>
                <PillBadge color="#c9a84c" bg="rgba(201,168,76,0.1)">Patient Stories</PillBadge>
                <DiamondDivider />
                <h2 className="font-display" style={{ fontSize: 48, fontWeight: 700, color: '#f0ece4', lineHeight: 1.12, marginBottom: 14, letterSpacing: '-0.02em' }}>
                  What Our Patients Are Saying
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(148,163,184,0.8)', fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                  Real experiences from people who trusted medi-connect with their care.
                </p>
              </div>
            </FadeUp>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <TestimonialCarousel />
          </div>
        </section>
        {/* WAVE 4 - bottom curve for Patient Stories into FAQ */}
        <div className="wave-sep" style={{ background: '#0c1929', marginTop: -2 }}>
          <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 90 }}>
            <path d="M0,50 C200,10 400,80 600,40 C800,0 1000,70 1200,35 C1330,15 1400,60 1440,45 L1440,90 L0,90 Z" fill="#fffdf8" />
          </svg>
        </div>

        {/* ────── FAQ ─────────────────────────── */}
        <section id="faq" style={{ background: '#fffdf8', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <FadeUp>
              <div style={{ textAlign: 'center', marginBottom: 44 }}>
                <PillBadge color="#8a6e30" bg="rgba(201,168,76,0.12)">FAQ</PillBadge>
                <DiamondDivider />
                <h2 className="font-display" style={{ fontSize: 40, fontWeight: 700, color: '#1a1200', lineHeight: 1.12, marginBottom: 10 }}>
                  Frequently Asked Questions
                </h2>
                <p style={{ maxWidth: 720, margin: '0 auto', fontSize: 15, color: '#5a4e38', lineHeight: 1.6 }}>
                  Quick answers to common questions about booking, telehealth, prescriptions, and records.
                </p>
              </div>
            </FadeUp>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {faqItems.map((f, i) => (
                <FadeUp key={f.q} delay={i * 40}>
                  <div style={{ background: '#ffffff', borderRadius: 12, padding: 0, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <button onClick={() => toggleFaq(i)} aria-expanded={openFaq === i} style={{
                      display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '18px 20px',
                      background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left'
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#2b1c13', flex: '1 1 auto' }}>{f.q}</div>
                      <div style={{ width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#6b4a2f', border: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
                        {openFaq === i ? '−' : '+'}
                      </div>
                    </button>
                    <div style={{ padding: openFaq === i ? '14px 20px 20px' : '0 20px', maxHeight: openFaq === i ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.32s ease, padding 0.28s ease' }}>
                      <div style={{ fontSize: 14, color: '#4a3a2b', lineHeight: 1.65 }}>{f.a}</div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        

        <Emergency />
        <Footer />
      </main>
    </>
  )
}