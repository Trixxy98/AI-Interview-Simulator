import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import useAxiosPrivate from './useAxiosPrivate'

const useLogout = () => {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async () => {
      await axiosPrivate.post('/auth/logout')
    },
    onSettled: () => {
      logout()
      queryClient.clear()
      navigate('/login')
    },
  })
}

export default useLogout