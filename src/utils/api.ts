import axios from 'axios';

export function getAPI(baseURL: string, accessToken: string) {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {'X-Api-Token': accessToken},
  });
}
