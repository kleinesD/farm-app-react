import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

const useGetAllFarmAnimals = () => {
  return useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data } = await apiClient.get(`api/animals/`);
      return data;
    }
  })
}

export default useGetAllFarmAnimals