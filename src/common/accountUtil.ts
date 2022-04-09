const TOKEN_KEY = 'user_token';
const LAST_UPDATE_KEY = 'last_update_time';
export const accountUtil = {
  setToken (token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(LAST_UPDATE_KEY, token ? (new Date().getTime() + '') : '');
  },
  getToken () {
    return localStorage.getItem(TOKEN_KEY) || '';
  },
  removeToken () {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LAST_UPDATE_KEY);
  },
  isLogin () {
    let token = accountUtil.getToken();
    let lastUpdateTime: number|string = localStorage.getItem(LAST_UPDATE_KEY) || '';
    if (!token || !lastUpdateTime) {
      return false;
    }
    lastUpdateTime = Number(lastUpdateTime);
    // 判断最后的更新时间是否大于1天
    let thenOneDay = (new Date().getTime() - lastUpdateTime) > 86400000;
    return !thenOneDay;
  }
};
