import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Public axios instance — no auth header
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Private axios instance — auth header injected by useAxiosPrivate hook
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
