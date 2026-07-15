import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mic, MicOff, Send, ChevronRight, Volume2 } from 'lucide-react'
import useInterview from '@/hooks/interview/useInterview'
import useSubmitAnswer from '@/hooks/interview/useSubmitAnswer'
import useAxiosPrivate from '@/hooks/auth/useAxiosPrivate'

const CATEGORY_COLOR: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-700',
  behavioural: 'bg-green-100 text-green-700',
  situational: 'bg-orange-100 text-orange-700',
}

const InterviewPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const { data, isLoading } = useInterview(id!)
  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)

  const recognitionRef = useRef<any>(null)

  const questions = data?.questions ?? []
  const interview = data?.interview
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  // Text-to-Speech — baca soalan secara automatik
  const speakQuestion = (text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.9
    utter.onstart = () => setIsSpeaking(true)
    utter.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  // Auto-play soalan bila index bertukar
  useEffect(() => {
    if (currentQuestion) {
      setTranscript('')
      setTimeout(() => speakQuestion(currentQuestion.content), 500)
    }
    return () => window.speechSynthesis?.cancel()
  }, [currentQuestion?._id])

  // Speech-to-Text — Web Speech API
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Please type your answer.')
      return
    }

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const result = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setTranscript(result)
    }

    recognition.onend = () => setIsRecording(false)
    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
  }

  const handleSubmit = async () => {
    if (!transcript.trim() || !interview || !currentQuestion) return

    recognitionRef.current?.stop()
    setIsRecording(false)

    submitAnswer(
      { interviewId: interview._id, questionId: currentQuestion._id, transcript },
      {
        onSuccess: async () => {
          const newCount = answeredCount + 1
          setAnsweredCount(newCount)

          if (isLastQuestion) {
            setIsFinishing(true)
            try {
              const res = await axiosPrivate.post(`/reports/interviews/${interview._id}/report`)
              navigate(`/report/${res.data.report._id}`)
            } catch {
              navigate('/dashboard')
            }
          } else {
            setCurrentIndex((i) => i + 1)
          }
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-violet-600 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-500">Loading interview...</p>
        </div>
      </div>
    )
  }

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="animate-spin h-8 w-8 text-violet-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Generating your report...</h2>
          <p className="text-gray-500 mt-2 text-sm">AI is analysing your performance</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header + Progress */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">{interview?.job_position}</p>
              <p className="text-sm text-gray-400 capitalize">{interview?.job_level} level</p>
            </div>
            <span className="text-sm font-medium text-gray-500">
              Question {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${CATEGORY_COLOR[currentQuestion?.category] ?? ''}`}>
              {currentQuestion?.category}
            </span>
            <span className="text-xs text-gray-400 capitalize">{currentQuestion?.difficulty}</span>
            <button
              onClick={() => speakQuestion(currentQuestion?.content)}
              className="ml-auto flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 transition"
            >
              <Volume2 size={14} />
              {isSpeaking ? 'Speaking...' : 'Replay'}
            </button>
          </div>
          <p className="text-lg font-medium text-gray-900 leading-relaxed">
            {currentQuestion?.content}
          </p>
        </div>

        {/* Answer Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Your Answer</label>
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isRecording
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isRecording ? <><MicOff size={14} /> Stop</> : <><Mic size={14} /> Speak</>}
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Speak your answer or type here..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800"
          />

          {isRecording && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Recording... speak your answer
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!transcript.trim() || isSubmitting || isFinishing}
            className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                AI is evaluating...
              </>
            ) : isLastQuestion ? (
              <><Send size={16} /> Submit & Generate Report</>
            ) : (
              <><ChevronRight size={16} /> Submit & Next Question</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage