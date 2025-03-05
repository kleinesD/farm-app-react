import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login, logout } from "../../../app/slices/userSlice";
import apiClient from "../../apiClient";

const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (loginData: { email: string, password: string }) => {
      const { data } = await apiClient.post('/api/users/login', loginData);
      return data;
    },
    onError: (error) => {
      console.error(error.message);
    },
    onSuccess: (response) => {
      dispatch(login(response.data.user));
    }
  })
}

export default useLogin;
