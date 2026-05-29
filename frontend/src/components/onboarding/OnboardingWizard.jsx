import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import GlassCard from '../ui/GlassCard'
import MagneticButton from '../ui/MagneticButton'
import FloatingParticles from '../three/FloatingParticles'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const specializations = [
  'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology', 'Surgery',
  'Oncology', 'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Emergency Medicine',
]

const patientSteps = ['Medical Info', 'Emergency Contact']
const doctorSteps = ['Professional', 'Availability', 'Documents']

export default function OnboardingWizard() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    bloodGroup: '', allergies: '', existingConditions: '', currentMedications: '',
    height: '', weight: '',
    emergencyContactName: '', emergencyContactNumber: '', relationshipWithEmergencyContact: '',
    specialization: '', yearsOfExperience: '', qualification: '', medicalLicenseNumber: '',
    hospitalOrClinicName: '', consultationFee: '', languagesSpoken: '', bio: '',
    availableDays: '', availableTimeSlots: '', consultationDuration: '',
    onlineConsultationAvailable: false, offlineConsultationAvailable: false,
    medicalLicenseDocument: '', governmentIdDocument: '', degreeCertificateDocument: '',
    clinicAddress: '',
  })

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        bloodGroup: user.bloodGroup || '',
        allergies: user.allergies || '',
        existingConditions: user.existingConditions || '',
        currentMedications: user.currentMedications || '',
        height: user.height != null ? String(user.height) : '',
        weight: user.weight != null ? String(user.weight) : '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactNumber: user.emergencyContactNumber || '',
        relationshipWithEmergencyContact: user.relationshipWithEmergencyContact || '',
        specialization: user.specialization || '',
        yearsOfExperience: user.yearsOfExperience != null ? String(user.yearsOfExperience) : '',
        qualification: user.qualification || '',
        medicalLicenseNumber: user.medicalLicenseNumber || '',
        hospitalOrClinicName: user.hospitalOrClinicName || '',
        consultationFee: user.consultationFee != null ? String(user.consultationFee) : '',
        languagesSpoken: user.languagesSpoken || '',
        bio: user.bio || '',
        availableDays: user.availableDays || '',
        availableTimeSlots: user.availableTimeSlots || '',
        consultationDuration: user.consultationDuration != null ? String(user.consultationDuration) : '',
        onlineConsultationAvailable: user.onlineConsultationAvailable ?? false,
        offlineConsultationAvailable: user.offlineConsultationAvailable ?? false,
        medicalLicenseDocument: user.medicalLicenseDocument || '',
        governmentIdDocument: user.governmentIdDocument || '',
        degreeCertificateDocument: user.degreeCertificateDocument || '',
        clinicAddress: user.clinicAddress || '',
      }))
    }
  }, [user])
  const [error, setError] = useState('')

  const update = (f, v) => setForm({ ...form, [f]: v })

  const role = user?.role || 'PATIENT'
  const steps = role === 'DOCTOR' ? doctorSteps : patientSteps

  const handleFinish = async () => {
    try {
      await authAPI.updateProfile(form)
      await refreshUser()
      navigate(role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient')
    } catch (err) {
      setError('Failed to save. Try again.')
    }
  }

  const cls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-neon/40 transition-colors"
  const lbl = "text-xs text-white/40 block mb-2"
  const sel = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon/40 transition-colors"

  const skipToDashboard = async () => {
    try {
      await authAPI.updateProfile({})
      await refreshUser()
      navigate(role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient')
    } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      <FloatingParticles count={800} color={role === 'DOCTOR' ? '#7c3aed' : '#00f0ff'} size={0.008} />
      <div className="absolute inset-0 mesh-gradient" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-2xl px-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon to-cyber flex items-center justify-center mx-auto mb-4">
            <span className="text-midnight font-bold text-2xl">M</span>
          </div>
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-white/40 mt-2">Just a few more details to get started</p>
        </div>

        <div className="flex gap-2 mb-6 max-w-md mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-1 rounded-full transition-all ${i <= step ? 'bg-neon' : 'bg-white/10'}`} />
              <span className={`text-xs ${i === step ? 'text-white' : 'text-white/30'}`}>{s}</span>
            </div>
          ))}
        </div>

        <GlassCard className="p-6 md:p-8">
          {error && <div className="text-red-400 text-sm mb-4 p-3 rounded-xl bg-red-500/10 border-red-500/20">{error}</div>}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {role === 'PATIENT' ? renderPatientStep(step) : renderDoctorStep(step)}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <MagneticButton type="button" variant="secondary" onClick={() => setStep(step - 1)}>Back</MagneticButton>
            ) : <div />}
            {step < steps.length - 1 ? (
              <MagneticButton type="button" variant="primary" onClick={async () => {
                try {
                  await authAPI.updateProfile(form)
                  setError('')
                } catch {
                  setError('Auto-save failed. Continue anyway?')
                }
                setStep(step + 1)
              }}>Continue</MagneticButton>
            ) : (
              <MagneticButton type="button" variant="primary" onClick={handleFinish}>Finish Setup</MagneticButton>
            )}
          </div>

          <p className="text-center mt-4">
            <button onClick={skipToDashboard} className="text-sm text-white/30 hover:text-white/60 transition-colors">Skip for now &rarr;</button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )

  function renderPatientStep(i) {
    switch (i) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Blood Group</label>
                <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} className={sel}>
                  <option value="">Select</option>
                  {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Height (cm)</label><input type="number" value={form.height} onChange={e => update('height', e.target.value)} className={cls} /></div>
              <div><label className={lbl}>Weight (kg)</label><input type="number" value={form.weight} onChange={e => update('weight', e.target.value)} className={cls} /></div>
            </div>
            <div><label className={lbl}>Allergies</label><textarea value={form.allergies} onChange={e => update('allergies', e.target.value)} className={cls + ' min-h-[70px]'} placeholder="List any allergies" /></div>
            <div><label className={lbl}>Medical History</label><textarea value={form.existingConditions} onChange={e => update('existingConditions', e.target.value)} className={cls + ' min-h-[70px]'} placeholder="Any existing conditions" /></div>
            <div><label className={lbl}>Current Medications</label><textarea value={form.currentMedications} onChange={e => update('currentMedications', e.target.value)} className={cls + ' min-h-[70px]'} placeholder="Current medications" /></div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={lbl}>Contact Name</label><input type="text" value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} className={cls} placeholder="Full name" /></div>
              <div><label className={lbl}>Phone Number</label><input type="tel" value={form.emergencyContactNumber} onChange={e => update('emergencyContactNumber', e.target.value)} className={cls} placeholder="Phone" /></div>
              <div><label className={lbl}>Relationship</label><input type="text" value={form.relationshipWithEmergencyContact} onChange={e => update('relationshipWithEmergencyContact', e.target.value)} className={cls} placeholder="e.g. Spouse" /></div>
            </div>
          </div>
        )
      default: return null
    }
  }

  function renderDoctorStep(i) {
    switch (i) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Specialization</label>
                <select value={form.specialization} onChange={e => update('specialization', e.target.value)} className={sel}>
                  <option value="">Select</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Years of Experience</label><input type="number" value={form.yearsOfExperience} onChange={e => update('yearsOfExperience', e.target.value)} className={cls} /></div>
              <div><label className={lbl}>Qualification</label><input type="text" value={form.qualification} onChange={e => update('qualification', e.target.value)} className={cls} placeholder="e.g. MD, MBBS" /></div>
              <div><label className={lbl}>Medical License #</label><input type="text" value={form.medicalLicenseNumber} onChange={e => update('medicalLicenseNumber', e.target.value)} className={cls} /></div>
              <div><label className={lbl}>Hospital / Clinic</label><input type="text" value={form.hospitalOrClinicName} onChange={e => update('hospitalOrClinicName', e.target.value)} className={cls} /></div>
              <div><label className={lbl}>Consultation Fee ($)</label><input type="number" value={form.consultationFee} onChange={e => update('consultationFee', e.target.value)} className={cls} /></div>
              <div><label className={lbl}>Languages Spoken</label><input type="text" value={form.languagesSpoken} onChange={e => update('languagesSpoken', e.target.value)} className={cls} /></div>
            </div>
            <div><label className={lbl}>Bio</label><textarea value={form.bio} onChange={e => update('bio', e.target.value)} className={cls + ' min-h-[80px]'} placeholder="Professional bio" /></div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={lbl}>Available Days</label><input type="text" value={form.availableDays} onChange={e => update('availableDays', e.target.value)} className={cls} placeholder="e.g. Mon-Fri" /></div>
              <div><label className={lbl}>Time Slots</label><input type="text" value={form.availableTimeSlots} onChange={e => update('availableTimeSlots', e.target.value)} className={cls} placeholder="e.g. 9AM-5PM" /></div>
              <div><label className={lbl}>Duration (min)</label><input type="number" value={form.consultationDuration} onChange={e => update('consultationDuration', e.target.value)} className={cls} /></div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input type="checkbox" checked={form.onlineConsultationAvailable} onChange={e => update('onlineConsultationAvailable', e.target.checked)} className="accent-neon" />
                Online consultations
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input type="checkbox" checked={form.offlineConsultationAvailable} onChange={e => update('offlineConsultationAvailable', e.target.checked)} className="accent-neon" />
                In-person consultations
              </label>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Verification Documents</h3>
            <p className="text-xs text-white/30 mb-4">Provide links to your documents for verification</p>
            {['Medical License', 'Government ID', 'Degree Certificate'].map((doc, idx) => {
              const fields = ['medicalLicenseDocument', 'governmentIdDocument', 'degreeCertificateDocument']
              return (
                <div key={idx}>
                  <label className={lbl}>{doc}</label>
                  <input type="url" value={form[fields[idx]]} onChange={e => update(fields[idx], e.target.value)} className={cls} placeholder="Document URL" />
                </div>
              )
            })}
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mt-6">Clinic Address</h3>
            <div><label className={lbl}>Clinic Address</label><textarea value={form.clinicAddress} onChange={e => update('clinicAddress', e.target.value)} className={cls + ' min-h-[80px]'} placeholder="Full clinic address" /></div>
          </div>
        )
      default: return null
    }
  }
}
