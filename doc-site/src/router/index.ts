import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router';
import DefaultLayout from '../layout/DefaultLayout.vue';
import demoRoutes from './docRoutes';
import { getStorageLangCode } from '../i18n/i18nUtil';

/**
 *  动态导入文档组件
 * @param docName
 */
const dynamicImportDoc = (docName: string) => {
  return () => {
    let langCode = getStorageLangCode();
    let langName = langCode == 'cn' ? 'zh-CN' : 'en-US';
    return import(`../siteDocs/${docName}.${langName}.md`);
  };
};

const routes: RouteRecordRaw[] = [
  {
    path: '/component',
    name: 'component',
    component: DefaultLayout,
    redirect: '/component/button',
    children: [
      /* {
        path: '/index',
        name: 'index',
        component: () => import('../views/Index.vue')
      }, */
      ...demoRoutes
    ]
  },
  {
    path: '/doc',
    name: 'doc',
    component: DefaultLayout,
    redirect: '/doc/introduce',
    children: [
      {
        path: 'introduce',
        name: 'introduce',
        component: dynamicImportDoc('introduce'),
        meta: {
          title: '关于Bootstrap Vue',
          enTitle: 'About Bootstrap Vue'
        }
      },
      {
        path: 'getting-started',
        name: 'getting-started',
        component: dynamicImportDoc('getting-started'),
        meta: {
          title: '快速上手',
          enTitle: 'Getting Started'
        }
      },
      {
        path: 'change-log',
        name: 'change-log',
        component: dynamicImportDoc('change-log'),
        meta: {
          title: '更新日志',
          enTitle: 'Change Log'
        }
      }
    ]
  },
  {
    path: '',
    redirect: '/component'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 };
  }
});

export default router;
