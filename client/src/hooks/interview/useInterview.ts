import {useQuery} from "@tanstack/react-query"
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate"
import type { string } from "zod"

const useInterview = (id: string) => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['interview', id],
        queryFn: async () => {
            const res = await axiosPrivate.get(`/interviews/${id}`)
            return res.data as {
                interview: {
                    _id: string
                    job_position: string
                    job_level: string
                    status: string
                }
                questions: Array<{
                    _id: string
                    content: string
                    category: string
                    difficulty: string
                    order_num: number
                }>
            }
        },
        enabled: !!id,
        staleTime: 0,
    })
}

export default useInterview