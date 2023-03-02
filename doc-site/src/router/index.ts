import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router';
import DefaultLayout from '../layout/DefaultLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/component',
    name: 'component',
    component: DefaultLayout,
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import('../views/Index.vue')
      }
    ]
  },
  {
    path: '',
    redirect: '/index'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
