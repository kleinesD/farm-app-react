import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:604',
  withCredentials: true // includes cookies
});

export default apiClient;