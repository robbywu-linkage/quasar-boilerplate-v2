import { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 登入才能見到
     */
    auth?: boolean;
    /**
     * 未登入才能見到
     */
    authOmit?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/AdminLayout.vue'),
        children: [
          {
            path: '/',
            component: () => import('pages/IndexPage.vue'),
            meta: { auth: true },
          },
        ],
      },
      {
        path: '/login',
        component: () => import('pages/LoginPage.vue'),
        meta: { authOmit: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
