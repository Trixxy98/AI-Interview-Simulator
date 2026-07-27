import {useQuery} from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/auth/useAxiosPrivate';

interface Answer {
    _id: string
    transcript: string
    score_technical: number
    score_comm: number
    score_grammar: number
    speaking_wpm: number
    ai_feedback: string
    question_id: {
        _id: string
        content: string
        category: string
        difficulty: string
        order_num: number
    }
}

const useAnswers = (interviewId: string) => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['answers', interviewId],
        queryFn: async () => {
            const res = await axiosPrivate.get(`/interviews/${interviewId}/answers`)
            return res.data.answers as Answer[]
        },
        enabled: !!interviewId,
        staleTime: Infinity,
    })
}

export default useAnswers;