import axios from 'axios';

export function getAPI(accessToken: string) {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {'X-Api-Token': accessToken},
  });
}
