import { useEffect, useRef, useState } from 'react'

const useMediaPipe = (videoRef: React.RefObject<HTMLVideoElement | null>, isReady: boolean) => {
  const [landmarks, setLandmarks] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const faceMeshRef = useRef<any>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!isReady) return

    let cancelled = false

    const loadFaceMesh = async () => {
      try {
        const FaceMesh = (window as any).FaceMesh
        if (!FaceMesh) {
          // Retry after 1s if script not loaded yet
          setTimeout(loadFaceMesh, 1000)
          return
        }

        const faceMesh = new FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
        })

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        faceMesh.onResults((results: any) => {
          if (results.multiFaceLandmarks?.[0]) {
            setLandmarks(results.multiFaceLandmarks[0])
          } else {
            setLandmarks([])
          }
        })

        await faceMesh.initialize()

        if (cancelled) return

        setIsLoaded(true)
        faceMeshRef.current = faceMesh

        const detect = async () => {
          if (cancelled) return
          if (videoRef.current && videoRef.current.readyState === 4) {
            await faceMesh.send({ image: videoRef.current })
          }
          rafRef.current = requestAnimationFrame(detect)
        }
        detect()
      } catch (err) {
        console.error('MediaPipe load failed:', err)
      }
    }

    loadFaceMesh()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      faceMeshRef.current?.close()
    }
  }, [isReady])

  return { landmarks, isLoaded }
}

export default useMediaPipe