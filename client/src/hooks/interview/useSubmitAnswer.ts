import { useMutation } from "@tanstack/react-query"
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate"

interface SubmitAnswerPayload {
    interviewId: string
    questionId : string
    transcript: string
}

const useSubmitAnswer = () => {
    const axiosPrivate = useAxiosPrivate()

    return useMutation({
        mutationFn: async ({interviewId, questionId, transcript}: SubmitAnswerPayload) => {
            const formData = new FormData()
            formData.append('question_id', questionId)
            formData.append('transcript', transcript)

            const res = await axiosPrivate.post(`/interviews/${interviewId}/answer`, formData)
            return res.data
        },
    })
}

export default useSubmitAnswer