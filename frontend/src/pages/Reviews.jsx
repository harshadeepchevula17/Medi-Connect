import { useState, useEffect } from 'react'
import { FiStar, FiSearch, FiThumbsUp, FiFlag } from 'react-icons/fi'
import { motion } from 'framer-motion'
import EmptyState from '../components/EmptyState'
import { reviewAPI } from '../utils/api'

export default function Reviews({ doctorId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!doctorId) {
      setLoading(false)
      return
    }
    reviewAPI.getByDoctor(doctorId)
      .then((res) => setReviews(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [doctorId])

  const filtered = reviews.filter((r) => {
    const matchFilter = filter === 'all' || (filter === 'positive' && (r.rating || 0) >= 4) || (filter === 'negative' && (r.rating || 0) < 3)
    const matchSearch = !search || r.patientName?.toLowerCase().includes(search.toLowerCase()) || r.comment?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Reviews</h1>
        <p className="text-sm text-slate-400 mt-1">Patient feedback and ratings</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
          <div className="text-3xl font-bold text-slate-800 tabular-nums">{averageRating}</div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${i <= Math.round(Number(averageRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <div className="text-xs text-slate-400 mt-1.5">{reviews.length} total reviews</div>
        </div>
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => Math.round(r.rating || 0) === star).length
                const pct = reviews.length ? (count / reviews.length) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-slate-500 font-medium">{star} star</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                      />
                    </div>
                    <span className="w-8 text-slate-400 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200">
              {['all', 'positive', 'negative'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FiStar}
              title="No reviews yet"
              message={reviews.length === 0 ? 'Reviews from patients will appear here' : 'No reviews match your filters'}
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((review, i) => (
                <motion.div
                  key={review.id || i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="p-4 rounded-xl border border-slate-200/60 hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {review.patientName?.[0] || 'P'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">{review.patientName || 'Anonymous'}</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <FiStar
                                key={s}
                                className={`w-3 h-3 ${s <= (review.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-slate-600 mt-1">{review.comment}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1.5">
                          {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-1.5 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all">
                        <FiThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                        <FiFlag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
