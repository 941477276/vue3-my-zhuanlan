import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router';
import { accountUtil } from '@/common/accountUtil';
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
        path: '/zhuanlan/:id',
        component: ZhuanLan,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/zhuanlan-article-detail/:id',
        component: ZhuanlanArticleDetail,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/create-zhuanlan-article/:id?',
        component: CreateZhuanlanArticle,
        meta: {
          requireAuth: true
        }
      }
    ]
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export { router };
export default router;
