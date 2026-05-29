import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import { chatAPI, appointmentAPI, fileAPI } from '../../utils/api'
import DragDropUpload from '../ui/DragDropUpload'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useAuth } from '../../context/AuthContext'
import PrescriptionModal from './PrescriptionModal'
import ConsultationReviewModal from './ConsultationReviewModal'

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }]

export default function VideoConsultation() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [remoteConnected, setRemoteConnected] = useState(false)
  const [streamReady, setStreamReady] = useState(false)
  const [showPrescription, setShowPrescription] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [chatDragging, setChatDragging] = useState(false)
  const chatEnd = useRef(null)
  const localVideo = useRef(null)
  const remoteVideo = useRef(null)
  const streamRef = useRef(null)
  const pcRef = useRef(null)
  const audioCtxRef = useRef(null)

  const roomId = `consultation-${appointmentId || 'new'}`
  const isPatient = user?.email === appointment?.patient?.email

  const handleChatMessage = useCallback((msg) => {
    setMessages((prev) => {
      if (prev.some(m => m.id && m.id === msg.id)) return prev
      if (msg.id && msg.id.toString().startsWith('temp-')) return prev
      const tempIndex = prev.findIndex(m =>
        String(m.id).startsWith('temp-') &&
        m.senderEmail === msg.senderEmail &&
        m.content === msg.content
      )
      if (tempIndex >= 0) {
        const updated = [...prev]
        updated[tempIndex] = msg
        return updated
      }
      return [...prev, msg]
    })
  }, [])

  const { connected, send, subscribe } = useWebSocket(`/topic/chat/${roomId}`, handleChatMessage)

  useEffect(() => {
    if (!appointmentId) { setLoading(false); return }
    appointmentAPI.getById(appointmentId).then(res => {
      setAppointment(res.data)
    }).catch(() => {
      navigate('/')
    }).finally(() => setLoading(false))
  }, [appointmentId, navigate])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: {
      echoCancellation: true, noiseSuppression: true, autoGainControl: true
    } }).then(stream => {
      streamRef.current = stream
      if (localVideo.current) localVideo.current.srcObject = stream
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length === 0) {
        console.warn('No audio track in stream')
      } else {
        audioTracks.forEach(t => { t.enabled = true })
      }
      stream.getVideoTracks().forEach(t => (t.enabled = isVideoOn))
      setStreamReady(true)
    }).catch((err) => {
      console.error('getUserMedia error:', err)
    })
  }, [])

  useEffect(() => {
    if (!streamRef.current) return
    const audioTrack = streamRef.current.getAudioTracks()[0]
    if (!audioTrack) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const src = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      let running = true
      const tick = () => {
        if (!running) return
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        setAudioLevel(Math.min(avg / 128, 1))
        requestAnimationFrame(tick)
      }
      tick()
      return () => { running = false; ctx.close() }
    } catch {}
  }, [streamReady])

  useEffect(() => {
    chatAPI.getMessages(roomId).then(res => {
      setMessages(res.data || [])
    }).catch(() => {})
  }, [roomId])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!connected || !appointment || !streamReady || !streamRef.current) return

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    pcRef.current = pc

    const sendStream = streamRef.current
    sendStream.getAudioTracks().forEach(t => { t.enabled = true; pc.addTrack(t, sendStream) })
    sendStream.getVideoTracks().forEach(t => { t.enabled = isVideoOn; pc.addTrack(t, sendStream) })

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams
      if (!remoteStream || !remoteVideo.current) return
      remoteVideo.current.srcObject = remoteStream
      remoteVideo.current.play().then(() => {
        setRemoteConnected(true)
      }).catch(() => {
        setRemoteConnected(true)
        if (!audioEnabled) {
          const enable = () => {
            remoteVideo.current?.play().catch(() => {})
            setAudioEnabled(true)
            document.removeEventListener('click', enable)
          }
          document.addEventListener('click', enable, { once: true })
        }
      })
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        send('/app/signal', { type: 'ice', roomId, data: event.candidate.toJSON() })
      }
    }

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setRemoteConnected(false)
      }
    }

    if (appointment.patient?.email === user?.email) {
      const initCall = async () => {
        try {
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          send('/app/signal', { type: 'offer', roomId, data: { sdp: offer.sdp, type: offer.type } })
        } catch {}
      }
      const timer = setTimeout(initCall, 1500)
      return () => { clearTimeout(timer); pc.close(); pcRef.current = null }
    }

    return () => { pc.close(); pcRef.current = null }
  }, [connected, appointment, user?.email, streamReady])

  useEffect(() => {
    if (!connected) return
    const unsub = subscribe(`/topic/signal/${roomId}`, async (signal) => {
      const pc = pcRef.current
      if (!pc || !signal?.type) return
      try {
        if (signal.type === 'offer' && appointment?.doctor?.email === user?.email) {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.data))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          send('/app/signal', { type: 'answer', roomId, data: { sdp: answer.sdp, type: answer.type } })
        } else if (signal.type === 'answer' && appointment?.patient?.email === user?.email) {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.data))
        } else if (signal.type === 'ice') {
          await pc.addIceCandidate(new RTCIceCandidate(signal.data))
        }
      } catch {}
    })
    return () => unsub?.()
  }, [connected, roomId, subscribe, send, appointment, user?.email])

  useEffect(() => {
    return () => {
      if (pcRef.current) { pcRef.current.close(); pcRef.current = null }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
      if (audioCtxRef.current) audioCtxRef.current.close()
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    const tempId = `temp-${Date.now()}`
    const msg = { roomId, senderEmail: user?.email, content: input, type: 'CHAT' }
    const optimistic = { ...msg, id: tempId, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, optimistic])
    setInput('')
    if (!connected || !send('/app/chat.send', msg)) {
      try {
        await chatAPI.sendMessage(msg)
      } catch (e) {
        setMessages((prev) => prev.filter(m => m.id !== tempId))
        console.error('Failed to send message:', e)
      }
    }
  }

  const handleFileSelect = async (file) => {
    setUploading(true)
    try {
      const res = await fileAPI.upload(file, 'chat')
      const msg = {
        roomId, senderEmail: user?.email, content: file.name, type: 'FILE',
        fileUrl: fileAPI.getDownloadUrl(res.data.id),
        fileId: res.data.id, fileName: file.name,
      }
      const tempId = `temp-${Date.now()}`
      const optimistic = { ...msg, id: tempId, timestamp: new Date().toISOString() }
      setMessages((prev) => [...prev, optimistic])
      if (!connected || !send('/app/chat.send', msg)) {
        await chatAPI.sendMessage(msg)
      }
    } catch (e) {
      console.error('Failed to send file:', e)
    }
    setUploading(false)
  }

  const toggleVideo = () => {
    const next = !isVideoOn
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => (t.enabled = next))
    }
    setIsVideoOn(next)
  }

  const toggleMute = () => {
    const next = !isMuted
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => (t.enabled = !next))
    }
    setIsMuted(next)
  }

  const goToDashboard = () => {
    const role = user?.role?.toLowerCase()
    if (role === 'doctor') navigate('/dashboard/doctor')
    else if (role === 'admin') navigate('/dashboard/admin')
    else navigate('/dashboard/patient')
  }

  const endCall = async () => {
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    try {
      if (appointment) await appointmentAPI.updateStatus(appointment.id, 'COMPLETED')
    } catch {}
    if (user?.role === 'DOCTOR' && appointment) {
      setShowPrescription(true)
    } else if (user?.role === 'PATIENT' && appointment) {
      setShowReview(true)
    } else {
      goToDashboard()
    }
  }

  const controls = [
    { icon: '🎙️', active: !isMuted, toggle: toggleMute, label: 'Mute' },
    { icon: '📹', active: isVideoOn, toggle: toggleVideo, label: 'Video' },
    { icon: '💬', active: chatOpen, toggle: () => setChatOpen(!chatOpen), label: 'Chat' },
    { icon: '📞', active: true, toggle: endCall, label: 'End', danger: true },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-cyber to-purple-500 animate-spin p-1">
            <div className="w-full h-full rounded-full bg-midnight" />
          </div>
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-cyber to-purple-500 animate-spin blur-md opacity-60" />
          <p className="text-white/40 text-xs text-center mt-4 tracking-widest uppercase">Connecting...</p>
        </div>
      </div>
    )
  }

  const doctorName = appointment?.doctor?.name || appointment?.symptoms || 'Consultation'
  const doctorSpecialty = appointment?.doctor?.specialization || ''

  return (
    <div className="min-h-screen bg-midnight p-4 relative">
      <div className="absolute inset-0 pointer-events-none mesh-gradient opacity-10" />
      <div className="max-w-7xl mx-auto h-[calc(100vh-32px)] relative z-10">
        <div className="grid lg:grid-cols-4 gap-4 h-full">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-deepblue to-darkpurple border border-white/10 shadow-[0_0_40px_-8px_rgba(0,255,168,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1] pointer-events-none" />
              <video ref={remoteVideo} autoPlay playsInline
                className="absolute inset-0 w-full h-full object-cover z-0" />
              <AnimatePresence>
                {!audioEnabled && remoteConnected && (
                  <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="absolute top-16 right-4 z-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl px-4 py-2 text-xs text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10 flex items-center gap-2">
                    <span>🔇</span> Click anywhere to enable audio
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!remoteConnected && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="relative w-28 h-28 mx-auto mb-5">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-neon via-cyber to-purple-500 flex items-center justify-center text-4xl shadow-lg shadow-neon/20">
                          👨‍⚕️
                        </div>
                      </div>
                      <p className="text-white/50 text-sm font-light tracking-wide">
                        {remoteConnected === null ? 'Establishing connection...' : 'Waiting for participant...'}
                      </p>
                      <div className="flex gap-1.5 justify-center mt-3">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-neon/40 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/[0.06] shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon to-violet-500 flex items-center justify-center text-sm font-bold text-midnight">
                    {doctorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">{doctorName}</h3>
                    <p className="text-[10px] text-white/30 tracking-wide">{doctorSpecialty || 'Specialist'}</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs bg-black/50 backdrop-blur-xl rounded-xl px-3 py-1.5 border border-white/[0.06]">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-yellow-500'}`} />
                <span className={`${connected ? 'text-green-300' : 'text-yellow-300'} font-light`}>
                  {connected ? 'Connected' : 'Connecting'}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 z-10">
                <div className="relative w-44 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/50 group/pip">
                  <video ref={localVideo} autoPlay playsInline muted
                    className="w-full h-full object-cover scale-x-[-1]" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-[#111827]/80 backdrop-blur-2xl border border-white/10">
              <div className="flex items-center gap-2 mr-3 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-neon"
                    animate={{ width: `${audioLevel * 100}%` }}
                    transition={{ duration: 0.08, ease: 'linear' }} />
                </div>
                <span className="text-[10px] text-white/25 font-mono w-7 text-right"
                  animate={{ opacity: audioLevel > 0.1 ? 1 : 0.4 }}>
                  {Math.round(audioLevel * 100)}%
                </span>
              </div>
              {controls.map((ctrl) => (
                <motion.button key={ctrl.label} onClick={ctrl.toggle}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`relative w-11 h-11 rounded-full flex items-center justify-center text-lg transition-colors ${
                    ctrl.danger ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_15px_-3px_rgba(239,68,68,0.4)]'
                      : ctrl.active
                        ? 'bg-white/10 hover:bg-white/15 border border-white/[0.06]'
                        : 'bg-red-500/15 text-red-400 border border-red-500/20'
                  }`}>
                  <span className="relative z-10">{ctrl.icon}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {chatOpen && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} className="hidden lg:flex flex-col">
              <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden depth-card bg-slate-950/95 border-slate-700/80 text-slate-100 shadow-[0_30px_80px_rgba(2,6,23,0.45)]" depth>
                <div className="relative bg-slate-900/80 px-5 py-4 border-b border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs shadow-lg shadow-cyan-500/20">
                      <span className="text-white font-bold">💬</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white tracking-wide">Consultation Chat</div>
                      <div className={`text-[10px] tracking-wider uppercase ${connected ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {connected ? 'Live — messages are encrypted' : 'Connecting...'}
                      </div>
                    </div>
                    <button onClick={() => setChatOpen(false)}
                      className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-slate-300 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 p-4 pr-2">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div key={msg.id || i} initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.senderEmail === user?.email ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'FILE' ? (
                          <a href="#"
                            onClick={(e) => { e.preventDefault(); const fid = msg.fileId || (msg.fileUrl && msg.fileUrl.split('/').pop()); if (fid) fileAPI.downloadFile(fid) }}
                            className={`max-w-[85%] p-3 rounded-2xl text-sm flex items-center gap-2.5 transition-shadow hover:shadow-lg ${
                              msg.senderEmail === user?.email
                                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white rounded-br-md border border-cyan-400/20'
                                : 'bg-slate-900 text-slate-200 rounded-bl-md border border-slate-700'
                            }`}>
                            <span className="text-base">📄</span>
                            <span className="underline decoration-white/20 hover:decoration-white/60 truncate">{msg.fileName || msg.content}</span>
                            <span className="text-[10px] text-slate-400 ml-auto shrink-0">↓</span>
                          </a>
                        ) : (
                          <div className={`relative max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.senderEmail === user?.email
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white rounded-br-md border border-cyan-400/20'
                              : 'bg-slate-900 text-slate-200 rounded-bl-md border border-slate-700'
                          }`}>{msg.content}</div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-2xl mb-3">💬</div>
                      <p className="text-slate-400 text-sm font-light">No messages yet</p>
                      <p className="text-slate-500 text-[10px] mt-1">Send a message to start the conversation</p>
                    </div>
                  )}
                  <div ref={chatEnd} />
                </div>

                <div className="relative px-4 pt-3 pb-4 border-t border-slate-700 bg-slate-900/80">
                  <div className="flex gap-2">
                    <div
                      className={`flex-1 relative rounded-2xl transition-all ${chatDragging ? 'ring-2 ring-cyan-400/40 ring-offset-0' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setChatDragging(true) }}
                      onDragLeave={() => setChatDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault()
                        setChatDragging(false)
                        const file = e.dataTransfer.files[0]
                        if (file) handleFileSelect(file)
                      }}
                    >
                      <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="input-premium w-full pr-12" />
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                        <button onClick={sendMessage}
                          className="w-7 h-7 rounded-full bg-gradient-to-r from-neon to-cyber flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,255,168,0.3)]">
                          <svg className="w-3.5 h-3.5 text-midnight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      <AnimatePresence>
                        {chatDragging && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="absolute inset-0 rounded-2xl border border-dashed border-cyan-400/50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center pointer-events-none"
                          >
                            <div className="px-3 py-1.5 rounded-full bg-cyan-400/10 text-cyan-200 text-[10px] font-medium tracking-wide shadow-[0_0_0_1px_rgba(34,211,238,0.15)]">
                              Drop file to attach
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <label className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0 cursor-pointer text-sm transition-colors border border-slate-700 self-end">
                      <span>📎</span>
                      <input type="file" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) handleFileSelect(file); e.target.value = '' }} />
                    </label>
                  </div>
                  <AnimatePresence>
                    {uploading && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="mt-2 text-[10px] text-cyan-300/70 flex items-center gap-2">
                        <div className="w-3 h-3 border border-cyan-300/60 border-t-transparent rounded-full animate-spin" />
                        Uploading file...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>

      <PrescriptionModal
        open={showPrescription}
        appointment={appointment}
        onClose={goToDashboard}
        onSaved={goToDashboard}
      />

      <ConsultationReviewModal
        open={showReview}
        appointment={appointment}
        onClose={goToDashboard}
        onSaved={goToDashboard}
      />
    </div>
  )
}
