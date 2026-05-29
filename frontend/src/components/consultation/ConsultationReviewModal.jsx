import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicAPI } from '../../utils/api'

export default function ConsultationReviewModal({ open, appointment, onClose, onSaved }) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [saving, setSaving] = useState(false)
  const [reportMode, setReportMode] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const doctorName = useMemo(() => appointment?.doctor?.name || appointment?.doctorName || 'your doctor', [appointment])

  const handleSave = async () => {
    if (!appointment?.id || !review.trim()) return
    setSaving(true)
    try {
      const payload = {
        appointmentId: appointment.id,
        rating,
        quote: review.trim(),
      }
      const docId = appointment?.doctor?.id || appointment?.doctorId || null
      if (docId) payload.doctorId = docId
      if (reportMode && reportReason.trim()) {
        payload.report = true
        payload.reportReason = reportReason.trim()
      }
      await publicAPI.submitTestimonial(payload)
      onSaved?.()
    } catch {}
    setSaving(false)
  }

  const stars = [1, 2, 3, 4, 5]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            className="w-full max-w-lg rounded-2xl bg-slate-950/95 border border-slate-700/80 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.6)] text-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Rate Your Consultation</h2>
                <p className="text-xs text-slate-400 mt-1">How was your session with {doctorName}?</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-400 block mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {stars.map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-11 h-11 rounded-full border transition-all flex items-center justify-center text-lg ${
                        star <= rating
                          ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.15)]'
                          : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                      }`}
                      aria-label={`${star} star rating`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-slate-400">{rating}/5</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Review</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us what went well and anything that could be better."
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors resize-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              <div className="pt-2">
                <button type="button" className="text-xs text-rose-400 underline" onClick={() => setReportMode(!reportMode)}>
                  {reportMode ? 'Cancel report' : 'Report Doctor'}
                </button>
                {reportMode && (
                  <div className="mt-3">
                    <label className="text-xs text-slate-400 block mb-1.5">Report Reason</label>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Describe the issue (harassment, inappropriate behavior, etc.)"
                      rows={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors resize-none focus:border-rose-400/60 focus:ring-2 focus:ring-rose-400/10"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-slate-700 text-sm text-slate-200 hover:bg-white/10 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !review.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {saving ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}