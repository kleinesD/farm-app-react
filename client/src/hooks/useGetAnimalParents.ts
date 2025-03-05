import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

const useGetParents = () => {
  return useQuery({
    queryKey: ['animal-parents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/animals/parents/get');

      interface Animal {
        title: string,
        subTitle?: string,
        value: string
      }

      interface Data {
        females: Animal[],
        males: Animal[]
      }

      let formatedData: Data = {
        females: data.data.females.map((animal: any) => { return { title: `#${animal.number}`, subTitle: animal.name ? animal.name : '', value: animal._id } }) || [],
        males: data.data.males.map((animal: any) => { return { title: `#${animal.number}`, subTitle: animal.name ? animal.name : '', value: animal._id } }) || []
      }

      return formatedData;
    }
  })
}

export default useGetParents;