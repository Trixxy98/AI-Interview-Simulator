import { axiosPublic } from '@/services/axios'
import { useAuthStore } from '@/store/authStore'

const useRefreshToken = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  const refresh = async () => {
    const res = await axiosPublic.post('/auth/refresh')
    setAccessToken(res.data.accessToken)
    return res.data.accessToken
  }

  return refresh
}

export default useRefreshToken