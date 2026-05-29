import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useData } from '../../hooks/useData'
import { useWebSocket } from '../../hooks/useWebSocket'
import { publicAPI, appointmentAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import GlassCard from '../ui/GlassCard'
import MagneticButton from '../ui/MagneticButton'

const DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
]

export default function DoctorDiscovery() {
  const ref = useRef(null)
  useScrollAnimation(ref, { animation: 'fadeUp', duration: 1 })
  const { data: doctors, loading } = useData(() => publicAPI.getDoctors(), [])
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [symptoms, setSymptoms] = useState('')
  const [booking, setBooking] = useState(false)
  const [bookingMsg, setBookingMsg] = useState('')
  const [lastBookingId, setLastBookingId] = useState(null)

  const { connected } = useWebSocket('/topic/appointments', (msg) => {
    if (!lastBookingId) return
    const data = msg.data || msg
    if (data.id === lastBookingId && data.status === 'CONFIRMED') {
      setBookingMsg('Doctor accepted! Launching consultation...')
      setTimeout(() => {
        setSelectedDoctor(null)
        setLastBookingId(null)
        navigate(`/video-consultation/${data.id}`)
      }, 1500)
    }
  })

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    setBooking(true)
    setBookingMsg('')
    try {
      const res = await appointmentAPI.book({ doctorId: selectedDoctor.id, symptoms })
      const appointment = res.data
      setLastBookingId(appointment.id)
      setBookingMsg('Appointment requested! Waiting for doctor to confirm...')
      setSymptoms('')
    } catch (err) {
      setBookingMsg(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setBooking(false)
    }
  }

  return (
    <section id="doctors" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-sky-50/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-100/15 rounded-full blur-[200px]" />
      <div className="absolute bottom-20 right-20 w-72 h-72 border border-blue-200/30 rounded-full animate-float-slow" />
      <div className="absolute top-32 left-32 w-56 h-56 border border-blue-200/20 rounded-full animate-float-medium" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-text-tertiary text-[11px] tracking-[0.3em] uppercase mb-4 block font-medium">
            Expert Network
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold mb-4">
            World-Class <span className="gradient-text">Specialists</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-text-tertiary max-w-xl mx-auto font-light">
            Connect with top-rated healthcare professionals powered by AI assistance
          </motion.p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-xl border border-black/[0.04] shadow-premium-lg rounded-2xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-black/[0.04] rounded-2xl mx-auto mb-4" />
                <div className="h-4 bg-black/[0.04] rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-black/[0.02] rounded w-1/2 mx-auto mb-3" />
                <div className="h-3 bg-black/[0.02] rounded w-full mb-4" />
                <div className="h-10 bg-black/[0.02] rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(doctors || []).length === 0 ? (
              <div className="col-span-full text-center text-text-tertiary py-12">
                No doctors registered yet. Check back soon!
              </div>
            ) : (
              (doctors || []).slice(0, 4).map((doc, i) => (
                <motion.div
                  key={doc.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <GlassCard className="p-6 text-center cursor-pointer group" glow hover depth onClick={() => setSelectedDoctor(doc)}>
                    <div className="relative inline-block mb-4">
                      <img
                        src={doc.imageUrl || DOCTOR_IMAGES[i]}
                        alt={doc.name}
                        className="w-20 h-20 rounded-2xl object-cover relative z-10 group-hover:scale-105 transition-transform duration-300 shadow-premium"
                      />
                      <div className="absolute inset-0 bg-primary/[0.06] rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-text-primary">{doc.name}</h3>
                    <p className="text-sm text-primary mb-3">{doc.specialization}</p>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(doc.rating || 0) ? 'text-amber-400' : 'text-black/10'}`}>★</span>
                      ))}
                      <span className="text-xs text-text-tertiary ml-1">{(doc.rating || 0).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-tertiary mb-4">
                      <span>{(doc.patientsCount || 0).toLocaleString()} patients</span>
                      <span className={`flex items-center gap-1.5 ${doc.online ? 'text-green-500' : 'text-black/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.online ? 'bg-green-500 animate-pulse' : 'bg-black/20'}`} />
                        {doc.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <MagneticButton variant="secondary" size="sm" className="w-full" onClick={() => setSelectedDoctor(doc)}>
                        Book Consultation
                      </MagneticButton>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/30 backdrop-blur-md"
            onClick={() => setSelectedDoctor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6" glass="premium" depth>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedDoctor.imageUrl || DOCTOR_IMAGES[0]}
                    alt={selectedDoctor.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Book Consultation</h3>
                    <p className="text-sm text-text-tertiary">with {selectedDoctor.name}</p>
                    <p className="text-xs text-text-tertiary/70">{selectedDoctor.specialization}</p>
                  </div>
                </div>

                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms..."
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/30 transition-colors min-h-[100px] mb-4 resize-none"
                />

                {bookingMsg && (
                  <div className={`text-sm mb-4 p-3 rounded-xl ${
                    bookingMsg.includes('failed') || bookingMsg.includes('error')
                      ? 'text-red-500 bg-red-50 border border-red-200'
                      : 'text-green-600 bg-green-50 border border-green-200'
                  }`}>
                    {bookingMsg}
                  </div>
                )}

                <div className="flex gap-3">
                  <MagneticButton variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedDoctor(null)}>
                    Cancel
                  </MagneticButton>
                  <MagneticButton variant="primary" size="sm" className="flex-1" onClick={handleBook} disabled={booking}>
                    {booking ? 'Booking...' : 'Confirm Booking'}
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
