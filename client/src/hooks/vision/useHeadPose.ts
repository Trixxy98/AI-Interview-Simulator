import { useEffect, useState } from 'react'

const useHeadPose = (landmarks: any[]) => {
    const [headPoseScore, setHeadPoseScore] = useState(100)
    const [isNodding, setIsNodding] = useState(false)
    const [isTurning, setIsTurning] = useState(false)

    useEffect(() => {
        if (landmarks.length === 0) return

        const nose = landmarks[1]
        const leftCheek = landmarks[234]
        const rightCheek = landmarks[454]
        const forehead = landmarks[10]
        const chin = landmarks[152]

        if (!nose || !leftCheek || !rightCheek) return

        const faceWidth = Math.abs(rightCheek.x - leftCheek.x)
        const noseOffset = Math.abs(nose.x - (leftCheek.x + rightCheek.x) /2)
        const yaw = noseOffset / faceWidth

        const  faceHeight = Math.abs(chin.y - forehead.y)
        const nosePitch = Math.abs(nose.y - (forehead.y + chin.y) / 2)
        const pitch = nosePitch / faceHeight

        const turning = yaw > 0.15
        const nodding = pitch > 0.1

        setIsTurning(turning)
        setIsNodding(nodding)

        const penalty = (turning ? 20: 0) + (nodding ? 10 : 0)
        setHeadPoseScore(Math.max(0,100 - penalty))
    }, [landmarks])

    return {headPoseScore, isNodding, isTurning}
}

export default useHeadPose