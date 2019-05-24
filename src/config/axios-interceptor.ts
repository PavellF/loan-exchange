import axios from 'axios';
import {AUTH_TOKEN_KEY, SERVER_API_URL} from './constants';
import {StorageUtils} from "../shared/util/storage-util";

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

const setupAxiosInterceptors = (onUnauthenticated: any) => {

  const onRequestSuccess = (config: any) => {
    const token = StorageUtils.local.get(AUTH_TOKEN_KEY) ||
      StorageUtils.session.get(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onResponseSuccess = response => response;
  //setup message errors
  const onResponseError = (err: any) => {
    const status = err.status || err.response.status;
    if (status === 403 || status === 401) {
      onUnauthenticated();
    }
    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
