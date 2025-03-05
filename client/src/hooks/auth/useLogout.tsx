import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login, logout } from "../../../app/slices/userSlice";
import apiClient from "../../apiClient";

const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/users/logout');
      return data;
    },
    onError: (error) => {
      console.error(error.message);
    },
    onSuccess: (response) => {
      dispatch(logout());
      
    }
  })
}

export default useLogout;
