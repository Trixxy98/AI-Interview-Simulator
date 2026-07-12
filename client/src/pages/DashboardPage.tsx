import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { LogOut, Plus, Trophy, TrendingUp, Calendar } from 'lucide-react'
import useLogout from '@/hooks/auth/useLogout'
import useAnalytics from '@/hooks/data/useAnalytics'
import useInterviewHistory from '@/hooks/data/useInterviewHistory'
import { useAuthStore } from '@/store/authStore'

const gradeLabel = (score: number) => {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-600' }
  if (score >= 75) return { label: 'Good', color: 'text-blue-600' }
  if (score >= 60) return { label: 'Average', color: 'text-yellow-600' }
  return { label: 'Needs Work', color: 'text-red-500' }
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { mutate: logout } = useLogout()
  const [page, setPage] = useState(1)

  const { data: analytics = [] } = useAnalytics()
  const { data: historyData, isLoading } = useInterviewHistory(page)

  const interviews = historyData?.interviews ?? []
  const pagination = historyData?.pagination

  const avgScore = analytics.length
    ? Math.round(analytics.reduce((a, b) => a + b.score_total, 0) / analytics.length)
    : 0
  const bestScore = analytics.length ? Math.max(...analytics.map((a) => a.score_total)) : 0

  const chartData = [...analytics]
    .reverse()
    .map((a, i) => ({ session: `#${i + 1}`, score: a.score_total }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Interview Simulator</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user?.name}</span>
          <button
            onClick={() => navigate('/interview/setup')}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
          >
            <Plus size={16} />
            New Interview
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-violet-600" />
              </div>
              <span className="text-gray-500 text-sm font-medium">Total Sessions</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{analytics.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <span className="text-gray-500 text-sm font-medium">Average Score</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{avgScore}</p>
            <p className={`text-sm font-medium mt-1 ${gradeLabel(avgScore).color}`}>
              {analytics.length ? gradeLabel(avgScore).label : '—'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy size={20} className="text-yellow-600" />
              </div>
              <span className="text-gray-500 text-sm font-medium">Best Score</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{bestScore || '—'}</p>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Progress</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="session" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Interview History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Interview History</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : interviews.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">No interviews yet</p>
              <button
                onClick={() => navigate('/interview/setup')}
                className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {interviews.map((iv: any) => {
                  const grade = gradeLabel(iv.score_total)
                  return (
                    <div key={iv._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div>
                        <p className="font-medium text-gray-900">{iv.job_position}</p>
                        <p className="text-sm text-gray-400 capitalize">
                          {iv.job_level} · {iv.status} · {new Date(iv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {iv.status === 'done' && (
                          <span className={`text-sm font-semibold ${grade.color}`}>
                            {iv.score_total}/100
                          </span>
                        )}
                        <button
                          onClick={() => navigate(`/interview/${iv._id}`)}
                          className="text-sm text-violet-600 font-medium hover:underline"
                        >
                          {iv.status === 'done' ? 'View Report' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === pagination.totalPages}
                    className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage