import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

const useGetMilkQualityRecords = () => {
  return useQuery({
    queryKey: ['milk-quality'],
    queryFn: async () => {
      const data = await apiClient.get('/api/milk/quality');
      return data?.data?.data?.records;
    }
  })

}

export default useGetMilkQualityRecords;