import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router';
import DefaultLayout from '@/layout/default-layout/DefaultLayout.vue';

import Home from '@/pages/home/Home.vue';
import ZhuanLan from '@/pages/zhuanlan/ZhuanLan.vue';
import ZhuanlanArticleDetail from '@/pages/zhuanlan-article-detail/ZhuanlanArticleDetail.vue';
import CreateZhuanlanArticle from '@/pages/create-zhuanlan-article/CreateZhuanlanArticle.vue';
import Login from '@/pages/login/Login.vue';
import Regist from '@/pages/regist/Regist.vue';

let routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: Home
      },
      {
        path: '/regist',
        component: Regist
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/zhuanlan',
        component: ZhuanLan
      },
      {
        path: '/zhuanlan-article-detail',
        component: ZhuanlanArticleDetail
      },
      {
        path: '/create-zhuanlan-article',
        component: CreateZhuanlanArticle
      }
    ]
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach(function (to, from) {
  window.scroll(0, 0);
});

export { router };
export default router;
