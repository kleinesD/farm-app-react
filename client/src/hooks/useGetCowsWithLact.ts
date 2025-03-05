import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

const useGetCowsWithLacts = () => {
  return useQuery({
    queryKey: ['cows-with-lact'],
    queryFn: async () => {
      const { data } = await apiClient.get(`api/animals/cows/lactations`);
      return data;
    }
  })
}

export default useGetCowsWithLacts