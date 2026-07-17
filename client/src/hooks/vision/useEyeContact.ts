import {useEffect, useRef, useState} from 'react'

const useEyeContact = (landmarks: any[]) => {
    const [isLookingAtCamera, setIsLookingAtCamera] = useState(false)
    const [gazeScore, setGazeScore] = useState(0)
    const framesRef = useRef({total: 0, looking: 0})

    useEffect(() => {
        if (landmarks.length === 0) return

        const leftIris = landmarks[468]
        const rightIris = landmarks[473]
        const leftEyeOuter = landmarks[33]
        const rightEyeOuter = landmarks[263]

        if (!leftIris || !rightIris) return

        const leftOffset = Math.abs(leftIris.x - ((leftEyeOuter.x + landmarks[133].x) / 2))
        const rightOffset = Math.abs(rightIris.x - ((rightEyeOuter.x + landmarks[362].x) / 2))
        const looking = leftOffset < 0.03 && rightOffset < 0.03

        framesRef.current.total += 1
        if (looking) framesRef.current.looking += 1

        setIsLookingAtCamera(looking)
        setGazeScore(Math.round((framesRef.current.looking / framesRef.current.total) * 100))
    }, [landmarks])

    const reset = () => {
        framesRef.current = {total: 0, looking: 0}
    }

    return {isLookingAtCamera, gazeScore, reset}
}

export default useEyeContact