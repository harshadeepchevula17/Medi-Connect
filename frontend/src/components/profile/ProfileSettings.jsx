import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import {
  FiUser, FiHome, FiClock, FiDollarSign, FiFile, FiBell, FiShield, FiSettings,
  FiChevronLeft, FiCheck, FiMail, FiPhone, FiMapPin, FiCalendar, FiGlobe,
  FiBook, FiActivity, FiHeart, FiAlertCircle, FiLock, FiEye, FiToggleLeft,
  FiUpload, FiSave, FiArrowLeft,
} from 'react-icons/fi'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const specializations = [
  'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology', 'Surgery',
  'Oncology', 'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Emergency Medicine',
]

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50/50 border border-slate-200/60 hover:bg-slate-50 cursor-pointer group transition-colors">
      <div className="min-w-0 mr-4">
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors">{label}</span>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="relative w-11 h-6 shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${checked ? 'bg-blue-600' : 'bg-slate-300'}`} />
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 left-0 w-4 h-4 rounded-full shadow-md ${checked ? 'bg-white' : 'bg-white'}`}
        />
      </div>
    </label>
  )
}

function SectionHeader({ title, description, icon: Icon }) {
  return (
    <div className="mb-6 pb-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type, icon: Icon, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type || 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl bg-white border border-slate-200/80 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all`}
        />
      </div>
      {hint && <p className="text-[11px] text-slate-400 pl-1">{hint}</p>}
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-3 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl bg-white border border-slate-200/80 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all min-h-[100px] resize-y`}
        />
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options, icon: Icon, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-8 py-2.5 rounded-xl bg-white border border-slate-200/80 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all appearance-none`}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function CardSection({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  )
}

const buildFormFromUser = (u = {}) => ({
  bloodGroup: u.bloodGroup || '', allergies: u.allergies || '', existingConditions: u.existingConditions || '', currentMedications: u.currentMedications || '',
  height: u.height != null ? String(u.height) : '', weight: u.weight != null ? String(u.weight) : '',
  emergencyContactName: u.emergencyContactName || '', emergencyContactNumber: u.emergencyContactNumber || '', relationshipWithEmergencyContact: u.relationshipWithEmergencyContact || '',
  country: u.country || '', state: u.state || '', city: u.city || '', postalCode: u.postalCode || '', address: u.address || '',
  yearsOfExperience: u.yearsOfExperience != null ? String(u.yearsOfExperience) : '', qualification: u.qualification || '', hospitalOrClinicName: u.hospitalOrClinicName || '', consultationFee: u.consultationFee != null ? String(u.consultationFee) : '',
  medicalLicenseNumber: u.medicalLicenseNumber || '', languagesSpoken: u.languagesSpoken || '', bio: u.bio || '',
  availableDays: u.availableDays || '', availableTimeSlots: u.availableTimeSlots || '', consultationDuration: u.consultationDuration != null ? String(u.consultationDuration) : '',
  onlineConsultationAvailable: u.onlineConsultationAvailable ?? false, offlineConsultationAvailable: u.offlineConsultationAvailable ?? false,
  clinicAddress: u.clinicAddress || '',
})

const doctorSections = [
  { id: 'profile', label: 'Profile Information', icon: FiUser, description: 'Manage your professional identity and credentials' },
  { id: 'clinic', label: 'Clinic Information', icon: FiHome, description: 'Your practice location and contact details' },
  { id: 'availability', label: 'Availability Settings', icon: FiClock, description: 'Set your consultation hours and slots' },
  { id: 'consultation', label: 'Consultation Settings', icon: FiDollarSign, description: 'Configure fees and consultation modes' },
  { id: 'documents', label: 'Documents', icon: FiFile, description: 'Upload and manage your credentials' },
  { id: 'notifications', label: 'Notifications', icon: FiBell, description: 'Manage your alert preferences' },
  { id: 'security', label: 'Security', icon: FiShield, description: 'Password and account security' },
]

const patientSections = [
  { id: 'personal', label: 'Personal Information', icon: FiUser, description: 'Your basic profile details' },
  { id: 'medical', label: 'Medical Information', icon: FiHeart, description: 'Health records and medical history' },
  { id: 'emergency', label: 'Emergency Contact', icon: FiAlertCircle, description: 'Who to reach in case of emergency' },
  { id: 'address', label: 'Address', icon: FiMapPin, description: 'Your residential address' },
  { id: 'notifications', label: 'Notification Preferences', icon: FiBell, description: 'Manage your alert preferences' },
  { id: 'privacy', label: 'Privacy Settings', icon: FiEye, description: 'Control your data visibility' },
  { id: 'security', label: 'Security Settings', icon: FiShield, description: 'Password and account security' },
  { id: 'preferences', label: 'Account Preferences', icon: FiSettings, description: 'General account settings' },
]

export default function ProfileSettings() {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [user, setUser] = useState(authUser)
  const [activeSection, setActiveSection] = useState('')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState(buildFormFromUser(authUser))

  useEffect(() => {
    authAPI.getProfile().then(res => {
      const u = res.data
      setUser(u)
      setForm(buildFormFromUser(u))
    }).catch(() => {
      if (!authUser) {
        navigate('/login')
        return
      }
      setUser(authUser)
      setForm(buildFormFromUser(authUser))
    })
  }, [authUser, navigate])

  useEffect(() => {
    if (user) {
      const sections = user.role === 'PATIENT' ? patientSections : doctorSections
      if (!activeSection || !sections.find(s => s.id === activeSection)) {
        setActiveSection(sections[0].id)
      }
    }
  }, [user, activeSection])

  const update = (f, v) => setForm({ ...form, [f]: v })

  const handleSave = async () => {
    try {
      const payload = { ...form }
      if (payload.height === '') payload.height = undefined
      if (payload.weight === '') payload.weight = undefined
      if (payload.yearsOfExperience === '') payload.yearsOfExperience = undefined
      if (payload.consultationFee === '') payload.consultationFee = undefined
      if (payload.consultationDuration === '') payload.consultationDuration = undefined
      await authAPI.updateProfile(payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || 'Unknown error'))
    }
  }

  if (!user) return null

  const role = user.role
  const sections = role === 'PATIENT' ? patientSections : doctorSections
  const avatarInitial = (user.name || 'U').charAt(0).toUpperCase()
  const activeSectionData = sections.find(s => s.id === activeSection)

  const renderNotificationToggles = () => (
    <div className="space-y-2">
      <ToggleSwitch checked={true} onChange={() => {}} label="Email Notifications" description="Receive updates via email" />
      <ToggleSwitch checked={true} onChange={() => {}} label="SMS Alerts" description="Get text message reminders" />
      <ToggleSwitch checked={false} onChange={() => {}} label="Appointment Reminders" description="Reminders before scheduled visits" />
      <ToggleSwitch checked={true} onChange={() => {}} label="Marketing & Promotions" description="Updates about new features" />
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FiLock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Password</h4>
            <p className="text-xs text-slate-400">Last changed 30 days ago</p>
          </div>
          <button className="ml-auto px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">
            Change
          </button>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
            <FiShield className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Two-Factor Authentication</h4>
            <p className="text-xs text-slate-400">Add an extra layer of security</p>
          </div>
          <button className="ml-auto px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Enable
          </button>
        </div>
      </div>
    </div>
  )

  const renderDoctorSection = (id) => {
    switch (id) {
      case 'profile':
        return (
          <div className="space-y-5">
            <SectionHeader title="Profile Information" description="Update your professional credentials and bio" icon={FiUser} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Years of Experience" value={form.yearsOfExperience} onChange={e => update('yearsOfExperience', e.target.value)} placeholder="e.g. 12" type="number" icon={FiCalendar} />
              <InputField label="Qualification" value={form.qualification} onChange={e => update('qualification', e.target.value)} placeholder="e.g. MD, MS, MBBS" icon={FiBook} />
              <InputField label="Medical License Number" value={form.medicalLicenseNumber} onChange={e => update('medicalLicenseNumber', e.target.value)} placeholder="License number" icon={FiFile} />
              <InputField label="Languages Spoken" value={form.languagesSpoken} onChange={e => update('languagesSpoken', e.target.value)} placeholder="e.g. English, Hindi, Spanish" icon={FiGlobe} />
            </div>
            <TextAreaField label="Professional Bio" value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Write a short professional biography..." icon={FiUser} />
          </div>
        )
      case 'clinic':
        return (
          <div className="space-y-5">
            <SectionHeader title="Clinic Information" description="Your practice location and contact details" icon={FiHome} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <InputField label="Hospital / Clinic Name" value={form.hospitalOrClinicName} onChange={e => update('hospitalOrClinicName', e.target.value)} placeholder="Name of hospital or clinic" icon={FiHome} />
              </div>
              <div className="md:col-span-2">
                <InputField label="Clinic Address" value={form.clinicAddress} onChange={e => update('clinicAddress', e.target.value)} placeholder="Full clinic address" icon={FiMapPin} />
              </div>
              <InputField label="Country" value={form.country} onChange={e => update('country', e.target.value)} placeholder="Country" icon={FiGlobe} />
              <InputField label="State" value={form.state} onChange={e => update('state', e.target.value)} placeholder="State" />
              <InputField label="City" value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" />
              <InputField label="Postal Code" value={form.postalCode} onChange={e => update('postalCode', e.target.value)} placeholder="Postal code" />
            </div>
          </div>
        )
      case 'availability':
        return (
          <div className="space-y-5">
            <SectionHeader title="Availability Settings" description="Define your consultation hours and schedule" icon={FiClock} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Available Days" value={form.availableDays} onChange={e => update('availableDays', e.target.value)} placeholder="e.g. Mon-Fri" icon={FiCalendar} hint="Specify which days you're available" />
              <InputField label="Available Time Slots" value={form.availableTimeSlots} onChange={e => update('availableTimeSlots', e.target.value)} placeholder="e.g. 9:00 AM - 5:00 PM" icon={FiClock} hint="Your working hours" />
              <InputField label="Consultation Duration" value={form.consultationDuration} onChange={e => update('consultationDuration', e.target.value)} placeholder="e.g. 30" type="number" icon={FiClock} hint="Duration in minutes" />
            </div>
          </div>
        )
      case 'consultation':
        return (
          <div className="space-y-5">
            <SectionHeader title="Consultation Settings" description="Configure your fees and consultation modes" icon={FiDollarSign} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Consultation Fee ($)" value={form.consultationFee} onChange={e => update('consultationFee', e.target.value)} placeholder="e.g. 50" type="number" icon={FiDollarSign} hint="Set your standard consultation fee" />
            </div>
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Consultation Modes</h4>
              <div className="space-y-2">
                <ToggleSwitch checked={form.onlineConsultationAvailable} onChange={e => update('onlineConsultationAvailable', e.target.checked)} label="Online Consultation" description="Accept video consultations through the platform" />
                <ToggleSwitch checked={form.offlineConsultationAvailable} onChange={e => update('offlineConsultationAvailable', e.target.checked)} label="Offline Consultation" description="Accept in-person visits at your clinic" />
              </div>
            </div>
          </div>
        )
      case 'documents':
        return (
          <div className="space-y-5">
            <SectionHeader title="Documents" description="Upload and manage your professional credentials" icon={FiFile} />
            <div className="grid grid-cols-1 gap-5">
              <InputField label="Medical License Document" value={form.medicalLicenseDocument || ''} onChange={e => update('medicalLicenseDocument', e.target.value)} placeholder="URL or document reference" icon={FiFile} />
              <InputField label="Government ID Document" value={form.governmentIdDocument || ''} onChange={e => update('governmentIdDocument', e.target.value)} placeholder="URL or document reference" icon={FiFile} />
              <InputField label="Degree Certificate Document" value={form.degreeCertificateDocument || ''} onChange={e => update('degreeCertificateDocument', e.target.value)} placeholder="URL or document reference" icon={FiFile} />
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                  <FiUpload className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-700">Upload Documents</h4>
                  <p className="text-xs text-slate-400">Drag & drop or click to upload PDF, JPG, or PNG files</p>
                </div>
                <button className="ml-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                  Browse
                </button>
              </div>
            </div>
          </div>
        )
      case 'notifications':
        return (
          <div className="space-y-5">
            <SectionHeader title="Notifications" description="Manage how you receive alerts and updates" icon={FiBell} />
            {renderNotificationToggles()}
          </div>
        )
      case 'security':
        return (
          <div className="space-y-5">
            <SectionHeader title="Security" description="Protect your account and patient data" icon={FiShield} />
            {renderSecuritySection()}
          </div>
        )
      default:
        return null
    }
  }

  const renderPatientSection = (id) => {
    switch (id) {
      case 'personal':
        return (
          <div className="space-y-5">
            <SectionHeader title="Personal Information" description="Your basic profile and identification" icon={FiUser} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Full Name" value={user.name || ''} onChange={() => {}} placeholder="Full name" icon={FiUser} />
              <InputField label="Email" value={user.email || ''} onChange={() => {}} placeholder="Email" icon={FiMail} />
              <InputField label="Phone" value={user.phone || ''} onChange={() => {}} placeholder="Phone number" icon={FiPhone} />
              <SelectField label="Blood Group" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} options={bloodGroups} placeholder="Select blood group" icon={FiActivity} />
            </div>
          </div>
        )
      case 'medical':
        return (
          <div className="space-y-5">
            <SectionHeader title="Medical Information" description="Your health records and medical history" icon={FiHeart} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Height (cm)" value={form.height} onChange={e => update('height', e.target.value)} placeholder="e.g. 170" type="number" icon={FiActivity} />
              <InputField label="Weight (kg)" value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="e.g. 70" type="number" icon={FiActivity} />
            </div>
            <TextAreaField label="Allergies" value={form.allergies} onChange={e => update('allergies', e.target.value)} placeholder="List any allergies you have..." icon={FiAlertCircle} />
            <TextAreaField label="Medical History / Existing Conditions" value={form.existingConditions} onChange={e => update('existingConditions', e.target.value)} placeholder="List any existing medical conditions..." icon={FiHeart} />
            <TextAreaField label="Current Medications" value={form.currentMedications} onChange={e => update('currentMedications', e.target.value)} placeholder="List current medications and dosages..." icon={FiBook} />
          </div>
        )
      case 'emergency':
        return (
          <div className="space-y-5">
            <SectionHeader title="Emergency Contact" description="Who to reach in case of an emergency" icon={FiAlertCircle} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Contact Name" value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} placeholder="Full name" icon={FiUser} />
              <InputField label="Phone Number" value={form.emergencyContactNumber} onChange={e => update('emergencyContactNumber', e.target.value)} placeholder="Phone number" type="tel" icon={FiPhone} />
              <InputField label="Relationship" value={form.relationshipWithEmergencyContact} onChange={e => update('relationshipWithEmergencyContact', e.target.value)} placeholder="e.g. Spouse, Parent, Sibling" icon={FiUser} />
            </div>
          </div>
        )
      case 'address':
        return (
          <div className="space-y-5">
            <SectionHeader title="Address" description="Your residential address" icon={FiMapPin} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Country" value={form.country} onChange={e => update('country', e.target.value)} placeholder="Country" icon={FiGlobe} />
              <InputField label="State" value={form.state} onChange={e => update('state', e.target.value)} placeholder="State" />
              <InputField label="City" value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" />
              <InputField label="Postal Code" value={form.postalCode} onChange={e => update('postalCode', e.target.value)} placeholder="Postal code" />
            </div>
            <TextAreaField label="Full Address" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Enter your full address..." icon={FiMapPin} />
          </div>
        )
      case 'notifications':
        return (
          <div className="space-y-5">
            <SectionHeader title="Notification Preferences" description="Control how we contact you" icon={FiBell} />
            {renderNotificationToggles()}
          </div>
        )
      case 'privacy':
        return (
          <div className="space-y-5">
            <SectionHeader title="Privacy Settings" description="Manage your data visibility preferences" icon={FiEye} />
            <div className="space-y-2">
              <ToggleSwitch checked={true} onChange={() => {}} label="Profile Visibility" description="Make your profile visible to doctors" />
              <ToggleSwitch checked={false} onChange={() => {}} label="Share Medical Records" description="Allow doctors to view your medical history" />
              <ToggleSwitch checked={true} onChange={() => {}} label="Activity Status" description="Show when you're active on the platform" />
              <ToggleSwitch checked={false} onChange={() => {}} label="Data Analytics" description="Help us improve with anonymous usage data" />
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="space-y-5">
            <SectionHeader title="Security Settings" description="Keep your account secure" icon={FiShield} />
            {renderSecuritySection()}
          </div>
        )
      case 'preferences':
        return (
          <div className="space-y-5">
            <SectionHeader title="Account Preferences" description="General account settings" icon={FiSettings} />
            <div className="space-y-2">
              <ToggleSwitch checked={true} onChange={() => {}} label="Auto-join Appointments" description="Automatically join scheduled video calls" />
              <ToggleSwitch checked={false} onChange={() => {}} label="Appointment Reminders" description="Get notified 24 hours before appointments" />
              <ToggleSwitch checked={true} onChange={() => {}} label="Dark Mode" description="Use dark theme across the platform" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_15%_30%,rgba(37,99,235,0.03),transparent_50%),radial-gradient(ellipse_at_75%_25%,rgba(6,182,212,0.02),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <FiArrowLeft className="w-4 h-4" />
            </motion.button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                {avatarInitial}
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  {user.name} <span className="w-1 h-1 rounded-full bg-slate-300" /> {user.email}
                </p>
              </div>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
              {role === 'DOCTOR' ? 'Doctor' : 'Patient'} Account
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <nav className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden lg:sticky lg:top-24">
                <div className="p-3 border-b border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">Settings Menu</p>
                </div>
                <div className="p-2 space-y-0.5">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-left">{section.label}</span>
                      </button>
                    )
                  })}
                </div>
              </nav>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex lg:hidden gap-1.5 mb-5 overflow-x-auto pb-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {section.label}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  <CardSection>
                    {role === 'PATIENT' ? renderPatientSection(activeSection) : renderDoctorSection(activeSection)}
                  </CardSection>
                </motion.div>
              </AnimatePresence>

              <motion.div
                layout
                className="mt-6 flex items-center gap-4"
              >
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
                >
                  <FiSave className="w-4 h-4" />
                  {saved ? 'Saved Successfully' : 'Save Changes'}
                </button>
                <AnimatePresence>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, x: -8, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -8, scale: 0.9 }}
                      className="text-sm text-emerald-600 font-medium flex items-center gap-1.5"
                    >
                      <FiCheck className="w-4 h-4" />
                      All changes saved
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
