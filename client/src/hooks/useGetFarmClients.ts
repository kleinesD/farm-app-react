import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

const useGetFarmClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await apiClient.get(`api/distribution/clients/get`);
      return data;
    }
  })
}

export default useGetFarmClients;