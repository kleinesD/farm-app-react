import apiClient from "../apiClient";

const animalNumberValidation = async (number: string) => {
  const {data} = await apiClient.get(`/api/animals/animal-by-number/${number}`);

  return data?.status !== 'success';
  
}

export default animalNumberValidation;