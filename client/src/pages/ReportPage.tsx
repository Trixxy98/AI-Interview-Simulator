import { useParams, useNavigate } from 'react-router-dom'
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react'
import useReport from '@/hooks/data/useReport'

const SCORE_DIMENSIONS = [
  { key: 'score_technical', label: 'Technical Knowledge', weight: '35%', color: 'bg-violet-500' },
  { key: 'score_communication', label: 'Communication', weight: '25%', color: 'bg-blue-500' },
  { key: 'score_confidence', label: 'Confidence', weight: '15%', color: 'bg-green-500' },
  { key: 'score_eye_contact', label: 'Eye Contact', weight: '10%', color: 'bg-yellow-500' },
  { key: 'score_grammar', label: 'Grammar', weight: '10%', color: 'bg-orange-500' },
  { key: 'score_speed', label: 'Speaking Speed', weight: '5%', color: 'bg-pink-500' },
] as const

const getGrade = (score: number) => {
  if (score >= 90) return { grade: 'A', label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
  if (score >= 75) return { grade: 'B', label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' }
  if (score >= 60) return { grade: 'C', label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' }
  return { grade: 'D', label: 'Needs Improvement', color: 'text-red-500', bg: 'bg-red-50 border-red-200' }
}

const ScoreBar = ({ label, score, weight, color }: { label: string; score: number; weight: string; color: string }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{weight}</span>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-700`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
)

const ReportPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: report, isLoading } = useReport(id!)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-violet-600 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-500">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!report) return null

  const { grade, label, color, bg } = getGrade(report.score_total)
  const interview = report.interview_id as any

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
          <button
            onClick={() => navigate('/interview/setup')}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
          >
            <RotateCcw size={14} />
            Try Again
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-gray-500 text-sm capitalize mb-1">
            {interview?.job_position} · {interview?.job_level} level
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Interview Report</h1>
        </div>

        {/* Overall Score */}
        <div className={`bg-white rounded-2xl shadow-sm border p-8 text-center ${bg}`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy size={32} className={color} />
            <div>
              <p className="text-6xl font-bold text-gray-900">{report.score_total}</p>
              <p className="text-gray-400 text-sm">out of 100</p>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${bg}`}>
            <span className={`text-2xl font-bold ${color}`}>{grade}</span>
            <span className={`font-medium ${color}`}>{label}</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Score Breakdown</h2>
          {SCORE_DIMENSIONS.map(({ key, label, weight, color }) => (
            <ScoreBar
              key={key}
              label={label}
              score={report[key]}
              weight={weight}
              color={color}
            />
          ))}
        </div>

        {/* AI Summary */}
        {report.summary && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Feedback</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{report.summary}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/interview/setup')}
            className="flex-1 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportPage