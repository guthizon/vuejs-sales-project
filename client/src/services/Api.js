import axios from 'axios';
import store from '@/store/store';
import router from '@/router';

export default () => {
  let baseURL = process.env.NODE_ENV === 'production' ? 'http://tripzone/' : 'http://localhost:8081/';
  // let baseURL = 'http://192.168.1.105:8081/';
  let instancia = axios.create({
    // baseURL: `http://localhost:8081/`,
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  });
  instancia.interceptors.response.use(async function (response) {
    return response;
  }, async function (error) {
    if (error.response && error.response.status) {
      if (error.response.status === 403) {
        if (router.currentRoute.name !== 'Login') {
          router.push({
            name: 'Login'
          });
        }
      }
    }
    return Promise.reject(error);
  });
  return instancia;
};
