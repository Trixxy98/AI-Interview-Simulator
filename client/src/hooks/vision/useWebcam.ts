import { useEffect, useRef, useState } from 'react'

const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setIsReady(true)
        }
      } catch {
        setError('Camera access denied. Please allow camera permission.')
      }
    }

    startCamera()

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      setIsReady(false)
    }
  }, [])

  return { videoRef, isReady, error }
}

export default useWebcam