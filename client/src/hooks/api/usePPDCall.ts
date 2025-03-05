import { useMutation } from "@tanstack/react-query";
import apiClient from "../../apiClient";

interface usePostProps {
  url: string,
  type: 'post' | 'patch' | 'delete';
}

const usePPDCall = ({ type, url }: usePostProps): any => {
  let request: any;
  if (type === 'post') request = apiClient.post;
  if (type === 'patch') request = apiClient.patch;
  if (type === 'delete') request = apiClient.delete;

  return useMutation({
    mutationFn: async (inputData: any) => {

      if(inputData) {
        const {data} = await request(url, inputData)
        return data;
      } else {
        const {data} = await request(url)
        return data
      }
    },
    onError: (error) => {
      console.log(error.message)
    }
  });
}

export default usePPDCall;