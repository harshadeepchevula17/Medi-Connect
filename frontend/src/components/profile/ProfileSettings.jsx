import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authAPI } from '../../utils/api'
import GlassCard from '../ui/GlassCard'
import MagneticButton from '../ui/MagneticButton'
import AnimatedBackground from '../three/AnimatedBackground'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const specializations = [
  'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology', 'Surgery',
  'Oncology', 'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Emergency Medicine',
]

const tabs = {
  PATIENT: ['Medical', 'Emergency', 'Address'],
  DOCTOR: ['Professional', 'Availability', 'Documents', 'Address'],
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative w-11 h-6">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${checked ? 'bg-gradient-to-r from-neon/60 to-cyber/60' : 'bg-white/10'}`} />
        <motion.div animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 left-0 w-4 h-4 rounded-full shadow-lg ${checked ? 'bg-white' : 'bg-white/40'}`} />
      </div>
      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
    </label>
  )
}

function SectionHeader({ title }) {
  return (
    <div className="relative mb-6 pb-3">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{title}</h3>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 h-px w-24 origin-left bg-gradient-to-r from-neon/50 via-cyber/30 to-transparent" />
    </div>
  )
}

function InputField({ label, value, onChange, cls, placeholder, type }) {
  return (
    <div>
      <label className="label-premium">{label}</label>
      <input type={type || 'text'} value={value} onChange={onChange}
        className={cls || 'input-premium w-full'} placeholder={placeholder} />
    </div>
  )
}

function TextAreaField({ label, value, onChange, cls, placeholder }) {
  return (
    <div>
      <label className="label-premium">{label}</label>
      <textarea value={value} onChange={onChange}
        className={cls || 'input-premium w-full min-h-[80px]'} placeholder={placeholder} />
    </div>
  )
}

const cls = "input-premium w-full"
const lbl = "label-premium"
const sel = "select-premium w-full"

export default function ProfileSettings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    bloodGroup: '', allergies: '', existingConditions: '', currentMedications: '',
    height: '', weight: '',
    emergencyContactName: '', emergencyContactNumber: '', relationshipWithEmergencyContact: '',
    country: '', state: '', city: '', postalCode: '', address: '',
    yearsOfExperience: '', qualification: '', hospitalOrClinicName: '', consultationFee: '',
    medicalLicenseNumber: '', languagesSpoken: '', bio: '',
    availableDays: '', availableTimeSlots: '', consultationDuration: '',
    onlineConsultationAvailable: false, offlineConsultationAvailable: false,
    clinicAddress: '',
  })

  useEffect(() => {
    authAPI.getProfile().then(res => {
      const u = res.data
      setUser(u)
      setForm({
        bloodGroup: u.bloodGroup || '',
        allergies: u.allergies || '',
        existingConditions: u.existingConditions || '',
        currentMedications: u.currentMedications || '',
        height: u.height != null ? String(u.height) : '',
        weight: u.weight != null ? String(u.weight) : '',
        emergencyContactName: u.emergencyContactName || '',
        emergencyContactNumber: u.emergencyContactNumber || '',
        relationshipWithEmergencyContact: u.relationshipWithEmergencyContact || '',
        country: u.country || '',
        state: u.state || '',
        city: u.city || '',
        postalCode: u.postalCode || '',
        address: u.address || '',
        yearsOfExperience: u.yearsOfExperience != null ? String(u.yearsOfExperience) : '',
        qualification: u.qualification || '',
        hospitalOrClinicName: u.hospitalOrClinicName || '',
        consultationFee: u.consultationFee != null ? String(u.consultationFee) : '',
        medicalLicenseNumber: u.medicalLicenseNumber || '',
        languagesSpoken: u.languagesSpoken || '',
        bio: u.bio || '',
        availableDays: u.availableDays || '',
        availableTimeSlots: u.availableTimeSlots || '',
        consultationDuration: u.consultationDuration != null ? String(u.consultationDuration) : '',
        onlineConsultationAvailable: u.onlineConsultationAvailable ?? false,
        offlineConsultationAvailable: u.offlineConsultationAvailable ?? false,
        clinicAddress: u.clinicAddress || '',
      })
    }).catch(() => navigate('/login'))
  }, [navigate])

  const update = (f, v) => setForm({ ...form, [f]: v })

  const handleSave = async () => {
    try {
      await authAPI.updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || 'Unknown error'))
    }
  }

  if (!user) return null

  const role = user.role
  const currentTabs = tabs[role] || []
  const avatarInitial = (user.name || 'U').charAt(0).toUpperCase()

  const renderPatientTab = (i) => {
    switch (i) {
      case 0:
        return (
          <div className="space-y-4">
            <SectionHeader title="Medical Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Blood Group</label>
                <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} className={sel}>
                  <option value="">Select</option>
                  {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <InputField label="Height (cm)" value={form.height} onChange={e => update('height', e.target.value)} cls={cls} placeholder="e.g. 170" type="number" />
              <InputField label="Weight (kg)" value={form.weight} onChange={e => update('weight', e.target.value)} cls={cls} placeholder="e.g. 70" type="number" />
            </div>
            <TextAreaField label="Allergies" value={form.allergies} onChange={e => update('allergies', e.target.value)} cls={cls + ' min-h-[80px]'} placeholder="List any allergies" />
            <TextAreaField label="Medical History / Existing Conditions" value={form.existingConditions} onChange={e => update('existingConditions', e.target.value)} cls={cls + ' min-h-[80px]'} placeholder="List any existing conditions" />
            <TextAreaField label="Current Medications" value={form.currentMedications} onChange={e => update('currentMedications', e.target.value)} cls={cls + ' min-h-[80px]'} placeholder="List current medications" />
            <div>
              <label className={lbl}>Reports / Documents</label>
              <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/10 p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon/20 to-cyber/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-white/40">Upload feature coming soon</p>
                  <p className="text-xs text-white/20">For now, add notes in the fields above</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <SectionHeader title="Emergency Contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Contact Name" value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} cls={cls} placeholder="Full name" />
              <InputField label="Phone Number" value={form.emergencyContactNumber} onChange={e => update('emergencyContactNumber', e.target.value)} cls={cls} placeholder="Phone" type="tel" />
              <InputField label="Relationship" value={form.relationshipWithEmergencyContact} onChange={e => update('relationshipWithEmergencyContact', e.target.value)} cls={cls} placeholder="e.g. Spouse, Parent" />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <SectionHeader title="Address" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Country" value={form.country} onChange={e => update('country', e.target.value)} cls={cls} />
              <InputField label="State" value={form.state} onChange={e => update('state', e.target.value)} cls={cls} />
              <InputField label="City" value={form.city} onChange={e => update('city', e.target.value)} cls={cls} />
              <InputField label="Postal Code" value={form.postalCode} onChange={e => update('postalCode', e.target.value)} cls={cls} />
            </div>
            <TextAreaField label="Address" value={form.address} onChange={e => update('address', e.target.value)} cls={cls + ' min-h-[80px]'} />
          </div>
        )
      default: return null
    }
  }

  const renderDoctorTab = (i) => {
    switch (i) {
      case 0:
        return (
          <div className="space-y-4">
            <SectionHeader title="Professional Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Years of Experience" value={form.yearsOfExperience} onChange={e => update('yearsOfExperience', e.target.value)} cls={cls} type="number" />
              <InputField label="Qualification" value={form.qualification} onChange={e => update('qualification', e.target.value)} cls={cls} placeholder="e.g. MD, MS" />
              <InputField label="Hospital / Clinic Name" value={form.hospitalOrClinicName} onChange={e => update('hospitalOrClinicName', e.target.value)} cls={cls} placeholder="Hospital or clinic name" />
              <InputField label="Consultation Fee ($)" value={form.consultationFee} onChange={e => update('consultationFee', e.target.value)} cls={cls} type="number" />
              <InputField label="Medical License Number" value={form.medicalLicenseNumber} onChange={e => update('medicalLicenseNumber', e.target.value)} cls={cls} placeholder="License number" />
              <InputField label="Languages Spoken" value={form.languagesSpoken} onChange={e => update('languagesSpoken', e.target.value)} cls={cls} placeholder="e.g. English, Hindi" />
              <div className="col-span-1 md:col-span-2">
                <label className={lbl}>Bio</label>
                <textarea value={form.bio} onChange={e => update('bio', e.target.value)} className={cls + ' min-h-[100px]'} placeholder="Short professional bio..." />
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <SectionHeader title="Availability" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Available Days" value={form.availableDays} onChange={e => update('availableDays', e.target.value)} cls={cls} placeholder="e.g. Mon-Fri" />
              <InputField label="Available Time Slots" value={form.availableTimeSlots} onChange={e => update('availableTimeSlots', e.target.value)} cls={cls} placeholder="e.g. 9:00 AM - 5:00 PM" />
              <InputField label="Consultation Duration (min)" value={form.consultationDuration} onChange={e => update('consultationDuration', e.target.value)} cls={cls} type="number" placeholder="e.g. 30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <ToggleSwitch checked={form.onlineConsultationAvailable} onChange={e => update('onlineConsultationAvailable', e.target.checked)} label="Online Consultation Available" />
              <ToggleSwitch checked={form.offlineConsultationAvailable} onChange={e => update('offlineConsultationAvailable', e.target.checked)} label="Offline Consultation Available" />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <SectionHeader title="Documents" />
            <InputField label="Medical License Document" value={form.medicalLicenseDocument} onChange={e => update('medicalLicenseDocument', e.target.value)} cls={cls} placeholder="URL or document reference" />
            <InputField label="Government ID Document" value={form.governmentIdDocument} onChange={e => update('governmentIdDocument', e.target.value)} cls={cls} placeholder="URL or document reference" />
            <InputField label="Degree Certificate Document" value={form.degreeCertificateDocument} onChange={e => update('degreeCertificateDocument', e.target.value)} cls={cls} placeholder="URL or document reference" />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <SectionHeader title="Address" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Country" value={form.country} onChange={e => update('country', e.target.value)} cls={cls} />
              <InputField label="State" value={form.state} onChange={e => update('state', e.target.value)} cls={cls} />
              <InputField label="City" value={form.city} onChange={e => update('city', e.target.value)} cls={cls} />
              <InputField label="Postal Code" value={form.postalCode} onChange={e => update('postalCode', e.target.value)} cls={cls} />
            </div>
            <TextAreaField label="Clinic Address" value={form.clinicAddress} onChange={e => update('clinicAddress', e.target.value)} cls={cls + ' min-h-[80px]'} />
          </div>
        )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-midnight relative py-12">
      <AnimatedBackground className="opacity-40" />
      <div className="absolute inset-0 pointer-events-none mesh-gradient opacity-20" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <motion.button onClick={() => navigate(-1)} whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="avatar-circle">{avatarInitial}</div>
              <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-sm text-white/40 flex items-center gap-1.5">
                  <span className="live-dot" />
                  {user.name} &middot; {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="flex gap-1.5 bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-1.5 border border-white/[0.06] overflow-x-auto">
              {currentTabs.map((t, i) => (
                <button key={t} onClick={() => setTab(i)}
                  className={'relative flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ' + (i === tab ? 'text-white' : 'text-white/40 hover:text-white/60')}>
                  {i === tab && (
                    <motion.div layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon/20 to-cyber/20 border border-white/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <GlassCard className="p-6 md:p-8 depth-card" depth>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {role === 'PATIENT' ? renderPatientTab(tab) : renderDoctorTab(tab)}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
              <MagneticButton variant="primary" onClick={handleSave} size="lg">
                {saved ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved Successfully
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </span>
                )}
              </MagneticButton>
              <AnimatePresence>
                {saved && (
                  <motion.span initial={{ opacity: 0, x: -10, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    className="text-green-400 text-sm flex items-center gap-1.5">
                    All changes saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
