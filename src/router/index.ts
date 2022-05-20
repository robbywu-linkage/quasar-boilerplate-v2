import { route } from 'quasar/wrappers';
import { get, isEmpty } from 'lodash';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import routes from './routes';

import { useAuthStore } from '../stores/auth-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const $storeAuth = useAuthStore();

    const authorization = get(to, 'query.authorization');
    // Query from url
    if (!isEmpty(authorization)) {
      $storeAuth.tokenSave(authorization);
    }

    // Login mode
    if ($storeAuth.isLogin) {
      // Should not enter after login
      if (get(to, 'meta.authOmit')) {
        next('/');
      } else {
        next();
      }
    }
    // Guest mode
    else {
      if (get(to, 'meta.auth')) {
        next(`/login?redirect=${to.path}`);
      } else {
        next();
      }
    }
  });

  return Router;
});
