import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

const useGetOneAnimal = (id: string | null) => {
  
  return useQuery({
    queryKey: ['animal'],
    queryFn: async () => {
      const { data } = await apiClient.get(`api/animals/${id}`);
      return data;
    },
    enabled: !!id
  })
}

export default useGetOneAnimal;