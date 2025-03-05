import { useMutation } from "@tanstack/react-query";
import apiClient from "../../apiClient";

interface Props {
  type: 'post' | 'patch' | 'delete'
}
interface InputData {
  url: string,
  data: object
}

const useMultiplePPDCalls = ({ type }: Props): any => {
  let request: any;
  if (type === 'post') request = apiClient.post;
  if (type === 'patch') request = apiClient.patch;
  if (type === 'delete') request = apiClient.delete;

  return useMutation({
    mutationFn: async (inputData: InputData[]) => {
      const reqArr = inputData.map(iData => {
        if(iData.data) {
          return request(iData.url, iData.data)
        } else {
          return request(iData.url)

        }
      });

      const results = await Promise.all(reqArr);
      return results.map(res => res.data);
    },
    onError: (error) => {
      console.log(error.message)
    }
  });
}

export default useMultiplePPDCalls;