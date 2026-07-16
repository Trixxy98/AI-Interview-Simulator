import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import InterviewSetupPage from '@/pages/InterviewSetupPage'
import InterviewPage from '@/pages/InterviewPage'
import ReportPage from '@/pages/ReportPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/interview/setup" element={<InterviewSetupPage />} />
        <Route path="/interview/:id" element={<InterviewPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App