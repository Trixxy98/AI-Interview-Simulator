import {useQuery} from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/auth/useAxiosPrivate';

const useAnalytics = () => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await axiosPrivate.get('/users/me/analytics')
            return res.data.analytics as Array<{
                interview_id: string
                job_position: string
                job_level: string
                ended_at: string
                score_total: number
                score_technical: number
                score_communication: number
            }>
        },
        staleTime: 5 * 60 * 1000,
    })
}

export default useAnalytics;