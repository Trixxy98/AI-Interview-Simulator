import {useEffect, useRef, useState} from 'react'
import {FaceMesh} from '@mediapipe/face_mesh'

const useMediaPipe = (videoRef: React.RefObject<HTMLVideoElement | null>, isReady: boolean) => {
    const [landmarks, setLandmarks] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const faceMeshRef = useRef<FaceMesh | null>(null)
    const rafRef = useRef<number>(0)
    
    useEffect(() => {
        if (!isReady) return

        const faceMesh = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        })

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        })

        faceMesh.onResults((results) => {
            if (results.multiFaceLandmarks?.[0]) {
                setLandmarks(results.multiFaceLandmarks[0])
            }else {
                setLandmarks([])
            }
        })

        faceMesh.initialize().then(() => {
            setIsLoaded(true) 
            faceMeshRef.current = faceMesh

            const detect = async () => {
                if (videoRef.current && videoRef.current.readyState === 4) {
                    await faceMesh.send({image: videoRef.current})
                }
                rafRef.current = requestAnimationFrame(detect)
            }
            detect()
        })

        return () => {
            cancelAnimationFrame(rafRef.current)
            faceMesh.close()
        }
    }, [isReady])

    return {landmarks, isLoaded}
}

export default useMediaPipe