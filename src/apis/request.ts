import axios from 'axios';
import { BsMessage } from '@/components/bootstrap/bs-message';
import { accountUtil } from '@/common/accountUtil';

let isDev = process.env.NODE_ENV === 'development';
const request = axios.create({
  baseURL: isDev ? '/viking' : '',
  timeout: 10000
});

request.interceptors.request.use(function (config) {
  let token = accountUtil.getToken();
  let isLogin = accountUtil.isLogin();

  if (isLogin && token) {
    // console.log(111);
    (config.headers as any).Authorization = token;
  }
  // console.log('config', config);

  return config;
}, function (error) {
  return Promise.reject(error);
});

request.interceptors.response.use(function (response) {
  // console.log(response);
  let data = response.data;
  if (data.code !== 0) {
    BsMessage.danger?.(data.msg);
    return Promise.reject(data);
  }
  return data;
}, function (error) {
  // @ts-ignore
  console.log(error);
  let msg = error.message === 'Request failed with status code 401' ? '未登陆或登陆已过期' : error.message;
  BsMessage.danger?.(msg);
  return Promise.reject(error);
});

export { request };
export default request;
