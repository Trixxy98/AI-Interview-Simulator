import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Auth routes */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      {/* Protected routes */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      {/* <Route path="/interview/setup" element={<InterviewSetupPage />} /> */}
      {/* <Route path="/interview/:id" element={<InterviewPage />} /> */}
      {/* <Route path="/report/:id" element={<ReportPage />} /> */}
      <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-gray-500">Page not found</div>} />
    </Routes>
  )
}

export default App
