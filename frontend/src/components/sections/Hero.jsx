import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-sky-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid lg:grid-cols-2 items-center gap-12">

        <div className="lg:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-blue-100 text-sm text-blue-600 font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Trusted by 10,000+ patients
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-slate-900"
          >
            Your Health,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
              Our Priority
            </span>
            <br />
            Care at Your Fingertips
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mt-5 text-lg text-slate-600 max-w-lg leading-relaxed"
          >
            Connect with top doctors, book appointments instantly, and manage your health journey — all from one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link
              to="/signup"
              className="inline-flex items-center h-12 px-7 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
            >
              Book Appointment
            </Link>

            <a
              href="#analytics"
              className="inline-flex items-center h-12 px-7 rounded-xl border border-slate-200 text-slate-700 bg-white/80 font-medium hover:bg-white hover:border-slate-300 transition-all"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center gap-6 flex-wrap"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://source.unsplash.com/100x100/?face,portrait&sig=${i}`}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-amber-400 text-xs">★★★★★</div>
              <span className="text-slate-500 font-medium">1,200+ happy patients</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center gap-8 border-t border-blue-100 pt-6"
          >
            {[
              { label: 'Doctors', value: '500+' },
              { label: 'Clinics', value: '50+' },
              { label: 'Years', value: '12+' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-200/40 via-sky-200/30 to-transparent rounded-[2rem] blur-2xl" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"
              alt="Doctor"
              className="w-full h-[500px] object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">✓</div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Available 24/7</div>
              <div className="text-xs text-slate-500">Online consultation</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow px-3 py-2 text-center"
          >
            <div className="text-lg font-bold text-blue-600">98%</div>
            <div className="text-[10px] text-slate-500 leading-tight">Satisfaction<br />Rate</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}