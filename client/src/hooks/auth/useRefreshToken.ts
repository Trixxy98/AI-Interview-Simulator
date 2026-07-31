import { axiosPublic } from '@/services/axios'
import { useAuthStore } from '@/store/authStore'

let inFlight: Promise<string> | null = null

const useRefreshToken = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  const refresh = async () => {
    if (!inFlight) {
      inFlight = axiosPublic
      .post('/auth/refresh')
      .then((res) => {
        const token = res.data.accessToken as string
        setAccessToken(token)
        return token
      })
      .finally(() => {
        inFlight = null
      })
    }
    return inFlight
  }

  return refresh
}

export default useRefreshToken