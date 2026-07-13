import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, ChevronDown } from 'lucide-react'
import useStartInterview from '@/hooks/interview/useStartInterview'

const JOB_SUGGESTIONS = [
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer',
  'Mobile Developer', 'DevOps Engineer', 'Data Scientist',
  'UI/UX Designer', 'Product Manager', 'QA Engineer',
]

const LEVELS = [
  { value: 'junior', label: 'Junior', desc: '0–2 years experience' },
  { value: 'mid', label: 'Mid', desc: '2–5 years experience' },
  { value: 'senior', label: 'Senior', desc: '5+ years experience' },
] as const

const InterviewSetupPage = () => {
  const navigate = useNavigate()
  const { mutate: startInterview, isPending } = useStartInterview()
  const [jobPosition, setJobPosition] = useState('')
  const [jobLevel, setJobLevel] = useState<'junior' | 'mid' | 'senior'>('junior')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filtered = JOB_SUGGESTIONS.filter((j) =>
    j.toLowerCase().includes(jobPosition.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobPosition.trim()) return
    startInterview({ job_position: jobPosition.trim(), job_level: jobLevel })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase size={28} className="text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Setup Your Interview</h1>
          <p className="text-gray-500 mt-2 text-sm">AI will generate 6 questions tailored to your role</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Job Position */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Position
            </label>
            <input
              value={jobPosition}
              onChange={(e) => { setJobPosition(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="e.g. Frontend Engineer"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {showSuggestions && filtered.length > 0 && jobPosition && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {filtered.map((job) => (
                  <button
                    key={job}
                    type="button"
                    onClick={() => { setJobPosition(job); setShowSuggestions(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-violet-50 hover:text-violet-700 transition first:rounded-t-lg last:rounded-b-lg"
                  >
                    {job}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setJobLevel(level.value)}
                  className={`p-3 rounded-xl border-2 text-center transition ${
                    jobLevel === level.value
                      ? 'border-violet-600 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold text-sm ${jobLevel === level.value ? 'text-violet-700' : 'text-gray-700'}`}>
                    {level.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{level.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !jobPosition.trim()}
            className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                AI is generating questions...
              </>
            ) : (
              'Start Interview →'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default InterviewSetupPage