import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { isBoolean, hasIn, set, isUndefined } from 'lodash';

import { useAuthStore } from '../stores/auth-store';
import { i18n } from './i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

declare module 'axios' {
  interface AxiosResponse<T = any> {
    /**
     * Error message
     */
    message: string;
    /**
     * Response result
     */
    data: T;
    /**
     * Other result
     */
    [key: string]: any;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.HOST,
});

export default boot(({ app }) => {
  /**
   * Request
   */
  api.interceptors.request.use(
    config => {
      const $storeAuth = useAuthStore();

      if ($storeAuth.isLogin) config.headers.Authorization = `Bearer ${$storeAuth.token}`;

      // If not have locale key, then add default locale
      if (!hasIn(config.params, 'locale')) {
        set(config, 'params.locale', i18n.global.locale.value);
      }

      return config;
    },
    error => {
      console.error('axios.interceptors.request', error);
      return Promise.reject(error);
    }
  );

  /**
   * Response
   */
  api.interceptors.response.use(
    response => {
      const $storeAuth = useAuthStore();
      const resToken = response.headers['authorization'];

      if (resToken && resToken !== $storeAuth.token) {
        $storeAuth.tokenSave(resToken);
      }

      // If request success send, but get response data success false, then throw error
      if (response.data && isBoolean(response.data.success) && !response.data.success) {
        throw response.data;
      } else {
        return response.data ? response.data : response;
      }
    },
    error => {
      // 錯誤原因是強制中斷
      if (axios.isCancel(error)) {
        return Promise.reject({ ...error, isCancel: true });
      }
      // 非預期內的錯誤
      else if (isUndefined(error.response)) {
        return Promise.reject({ status: false, message: error });
      }

      const _response = transformResponse(error.response);

      if (_response) {
        switch (_response.status) {
          case 401:
            return resetTokenRedirectLogin();
          case 403:
            return resetTokenRedirectLogin();
        }
        console.error('axios.interceptors.response', error.response);
        return Promise.reject(
          error.response.data as {
            code: string;
            data: any;
            message: string;
            success: boolean;
          }
        );
      } else {
        console.error('axios.interceptors.response.empty', error);
        return resetTokenRedirectLogin();
      }
    }
  );

  /**
   * 清除 Token 並返回登入頁
   */
  function resetTokenRedirectLogin() {
    useAuthStore().tokenLogout();
    const { origin, pathname, search } = window.location;
    window.location.href = `${origin}/login?redirect=${pathname}${search}`;
  }

  /**
   * 判斷是否為 arraybuffer 型別
   */
  function isArraybuffer(response: AxiosResponse) {
    return response.request.responseType === 'arraybuffer' && response.data.toString() === '[object ArrayBuffer]';
  }

  /**
   * 將 response.data 從 Arraybuffer 轉換為 Blob 格式
   */
  function transformResponse(response: AxiosResponse) {
    if (isArraybuffer(response)) {
      response.data = new Blob([response.data]);
    }
    return response;
  }

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
