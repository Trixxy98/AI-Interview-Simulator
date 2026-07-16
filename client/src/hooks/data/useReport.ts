import {useQuery} from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/auth/useAxiosPrivate'

interface Report {
    _id: string
    interview_id: {
        _id: string
        job_position: string
        job_level: string
        ended_at: string
    }
    score_technical: number
    score_communication: number
    score_confidence: number
    score_eye_contact: number
    score_grammar: number
    score_speed: number
    score_total: number
    summary: string
    created_at: string
}

const useReport = (id: string) => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['report', id],
        queryFn: async () => {
            const res = await axiosPrivate.get(`/reports/${id}`)
            return res.data.report as Report
        },
        enabled: !!id,
        staleTime: Infinity,
    })
}

export default useReport