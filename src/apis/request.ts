import axios from 'axios';
import { BsMessage } from '@/components/bootstrap/bs-message';

let isDev = process.env.NODE_ENV === 'development';
const request = axios.create({
  baseURL: isDev ? '/viking' : '',
  timeout: 10000
});

request.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

request.interceptors.response.use(function (response) {
  console.log(response);
  let data = response.data;
  if (data.code !== 0) {
    BsMessage.danger?.(data.msg);
    return Promise.reject(data);
  }
  return data;
}, function (error) {
  // @ts-ignore
  console.log(error, this);
  BsMessage.danger?.(error.message);
  return Promise.reject(error);
});

export { request };
export default request;
