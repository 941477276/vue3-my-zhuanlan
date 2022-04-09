import { accountUtil } from '@/common/accountUtil';
import { Router } from 'vue-router';
import store from '@/store';

export default function (router: Router) {
  router.beforeEach(async function (to, from, next) {
    let meta = to.meta;
    let isLogin = accountUtil.isLogin();
    console.log('是否已经登陆', isLogin);
    // 如果用户已经登陆了，但是未获取用户信息，则先获取用户信息
    if (isLogin && !store.state.userInfo._id) {
      await store.dispatch('getUserInfo');
    }
    if (meta && meta.requireAuth) {
      if (isLogin) {
        console.log('登陆了', store.state.userInfo);
        next();
      } else {
        store.dispatch('logout');
        next({
          path: '/login',
          query: {
            redirect: encodeURIComponent(to.fullPath)
          }
        });
      }
    } else {
      next();
    }
  });

  router.afterEach(function (to, from) {
    window.scroll(0, 0);
  });
};
