import { request } from './request';
export const userApi = {
  /**
   * 注册用户
   * @param email 邮箱
   * @param password 密码
   * @param nickName 昵称
   */
  regist (email: string, password: string, nickName: string) {
    return request.post('/api/users', {
      email,
      password,
      nickName
    });
  },
  /**
   * 登陆
   * @param email 邮箱
   * @param password 密码
   */
  login (email: string, password: string) {
    return request.post('/api/user/login', {
      email,
      password
    });
  },
  /**
   * 获取登陆用户信息
   */
  getUserInfo () {
    return request.get('/api/user/current');
  },
  /**
   * 更新用户信息
   * @param id 用户ID
   * @param data 用户数据
   */
  updateUser (id: string, data: {[key: string]: any}) {
    return request.patch(`/api/user/${id}`, data);
  }
};
