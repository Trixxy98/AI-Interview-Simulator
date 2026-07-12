import {useQuery, keepPreviousData} from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/auth/useAxiosPrivate';

const useInterviewHistory = (page = 1) => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['interview', page],
        queryFn: async () => {
            const res = await axiosPrivate.get(`/interview?page=${page}`)
            return res.data
        },
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
    })
}

export default useInterviewHistory;