import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

const useGetFarmAnimals = () => {
  return useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data } = await apiClient.get(`api/animals/alive/get`);
      return data;
    }
  })
}

export default useGetFarmAnimals