import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { axiosPublic } from '@/services/axios'
import { useAuthStore } from '@/store/authStore'

const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await axiosPublic.post('/auth/login', credentials)
      return res.data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      navigate('/dashboard')
    },
  })
}

export default useLogin