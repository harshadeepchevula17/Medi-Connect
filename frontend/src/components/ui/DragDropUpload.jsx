import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function DragDropUpload({ onFileSelect, accept = '*', maxSize = 10 * 1024 * 1024 }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.size <= maxSize) {
      onFileSelect(file)
    }
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= maxSize) {
      onFileSelect(file)
    }
    e.target.value = ''
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-neon bg-neon/10 scale-[1.02]'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <motion.div animate={{ scale: dragging ? 1.1 : 1 }} className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon to-cyber/60 flex items-center justify-center text-lg">
          {dragging ? '📄' : '📁'}
        </div>
        <p className="text-sm text-white/60">
          {dragging ? 'Drop your file here' : 'Drag & drop a file, or click to browse'}
        </p>
        <p className="text-[10px] text-white/20">Max {Math.round(maxSize / 1024 / 1024)}MB</p>
      </motion.div>
    </div>
  )
}
