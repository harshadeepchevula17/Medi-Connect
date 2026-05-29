import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { prescriptionAPI } from '../../utils/api'

export default function PrescriptionModal({ open, appointment, onClose, onSaved }) {
  const [medications, setMedications] = useState('')
  const [instructions, setInstructions] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!medications.trim()) return
    setSaving(true)
    try {
      await prescriptionAPI.create({
        appointmentId: appointment.id,
        patientId: appointment.patient?.id || appointment.patientId,
        medications,
        instructions,
        notes,
      })
      onSaved?.()
    } catch {}
    setSaving(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg rounded-2xl bg-slate-950/95 border border-slate-700/80 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.6)] text-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Write Prescription</h2>
                <p className="text-xs text-slate-400 mt-1">for {appointment?.patient?.name || appointment?.patientName || 'Patient'}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm text-slate-300">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Medications *</label>
                <textarea value={medications} onChange={(e) => setMedications(e.target.value)}
                  placeholder="Paracetamol 500mg — 1 tablet twice daily&#10;Amoxicillin 250mg — 1 capsule three times daily"
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors resize-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Instructions</label>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Take after meals. Avoid alcohol. Complete the full course."
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors resize-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Additional Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Follow up in 7 days if symptoms persist."
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors resize-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-slate-700 text-sm text-slate-200 hover:bg-white/10 transition-colors">
                Skip
              </button>
              <button onClick={handleSave} disabled={saving || !medications.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
                {saving ? 'Saving...' : 'Save Prescription'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
