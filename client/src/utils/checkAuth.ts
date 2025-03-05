import { useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';

const checkAuth = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/users/auth/check');
      return data;
    }
  })
};

export default checkAuth;