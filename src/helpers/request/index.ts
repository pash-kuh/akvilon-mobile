import axios from 'axios';

export const api = (url) => {
  return axios.create({
    baseURL: `https://${url}v1/`,
  });
};
export const apiMobile = (url) => {
  return axios.create({
    baseURL: `https://${url}mobile/v1/`,
  });
};
