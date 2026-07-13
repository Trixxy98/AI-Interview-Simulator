import {useMutation} from "@tanstack/react-query"
import {useNavigate} from "react-router-dom"
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate"

interface StartInterviewPayload {
    job_position: string
    job_level: 'junior' | 'mid' | 'senior'
}

const useStartInterview = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (payload: StartInterviewPayload) => {
            const res = await axiosPrivate.post('/interviews', payload)
            return res.data
        },
        onSuccess: (data) => {
            navigate(`/interview/${data.interview._id}`)
        },
    })
}

export default useStartInterview