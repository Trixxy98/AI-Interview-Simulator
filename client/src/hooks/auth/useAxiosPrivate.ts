import { useEffect } from 'react'
import { axiosPrivate } from '@/services/axios'
import { useAuthStore } from '@/store/authStore'
import useRefreshToken from './useRefreshToken'

const useAxiosPrivate = () => {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refresh = useRefreshToken()

  useEffect(() => {
    const reqInterceptor = axiosPrivate.interceptors.request.use((config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
      return config
    })

    const resInterceptor = axiosPrivate.interceptors.response.use(
      (res) => res,
      async (err) => {
        const prev = err?.config
        if (err?.response?.status === 401 && !prev?._retry) {
          prev._retry = true
          const newToken = await refresh()
          prev.headers['Authorization'] = `Bearer ${newToken}`
          return axiosPrivate(prev)
        }
        return Promise.reject(err)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(reqInterceptor)
      axiosPrivate.interceptors.response.eject(resInterceptor)
    }
  }, [accessToken, refresh])

  return axiosPrivate
}

export default useAxiosPrivate