import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import AiSphere from '../three/AiSphere'
import { aiAPI } from '../../utils/api'

const quickActions = [
  'Check my symptoms',
  'Medication reminder',
  'Schedule appointment',
  'Health tips',
  'Emergency guide',
  'Lab results analysis',
]

export default function AiChat() {
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: 'Hello! I\'m MediAssist, your AI health companion. How can I help you today?',
    timestamp: new Date(),
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const chatEnd = useRef(null)

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const msg = text || input
    if (!msg.trim()) return
    const userMsg = { role: 'user', text: msg, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    try {
      const res = await aiAPI.chat(msg, sessionId)
      const data = res.data
      if (!sessionId) setSessionId(data.sessionId)
      const aiMsg = { role: 'ai', text: data.message, timestamp: new Date(data.timestamp) }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const fallback = 'I apologize, but I\'m having trouble connecting to my knowledge base. Please try again or consult a healthcare professional for immediate assistance.'
      setMessages((prev) => [...prev, { role: 'ai', text: fallback, timestamp: new Date() }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen bg-midnight relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-cyber flex items-center justify-center">
              <span className="text-midnight font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-sm">MediAssist AI</span>
          </div>
          <span className="badge-glow text-[10px]">
            <span className="live-dot" />
            AI Online
          </span>
        </div>
      </nav>

      <div className="pt-16 h-screen flex">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16"><AiSphere /></div>
            <div>
              <h1 className="text-xl font-bold">MediAssist</h1>
              <p className="badge-glow text-xs">
                <span className="live-dot" />
                AI Health Companion · Powered by MediConnect
              </p>
            </div>
          </motion.div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-neon to-cyber text-midnight rounded-br-md'
                      : 'glass rounded-bl-md'
                  }`}>{msg.text}</div>
                  <div className={`text-[10px] text-white/20 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-md p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEnd} />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action) => (
              <button key={action} onClick={() => handleSend(action)}
                className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-neon/30 transition-all">
                {action}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your symptoms or ask a question..."
              className="input-premium flex-1"
              disabled={isTyping}
            />
            <button onClick={() => handleSend()} disabled={isTyping}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-neon to-cyber text-midnight font-semibold hover:shadow-glow transition-shadow disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
