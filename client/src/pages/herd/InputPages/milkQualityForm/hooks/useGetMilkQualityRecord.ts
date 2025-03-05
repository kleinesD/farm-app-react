import { useQuery } from "@tanstack/react-query"
import apiClient from "../../../../../apiClient"


const useGetMilkQualityRecord = (id: string | null) => {
  return useQuery({
    queryKey: ['milk-quality-record'],
    queryFn: async () => {
      const data = await apiClient.get(`/api/milk/quality/record/${id}`);
      return data;
    },
    enabled: !!id
  })
}

export default useGetMilkQualityRecord;