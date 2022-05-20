import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { isEmpty } from 'lodash';

import api from '../api';

export const ACCESS_TOKEN = 'access_token';

export interface IUser {
  permissions: Array<string>;
  roleName: string;
  userId: number;
  username: string;
  loginType: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
  lastLoginTime: string;
  registerTime: string;
}

export interface AuthStateInterface {
  token: string | null;
  user: IUser | null;
}

export const InitialAuthState: AuthStateInterface = {
  token: LocalStorage.getItem(ACCESS_TOKEN) ?? null,
  user: null,
};

export const useAuthStore = defineStore('auth', {
  state: () => Object.assign({}, InitialAuthState),
  getters: {
    isLogin: state => !isEmpty(state.token),
  },
  actions: {
    tokenSave(token: string) {
      this.token = token;
      LocalStorage.set(ACCESS_TOKEN, token);
    },
    tokenLogout() {
      LocalStorage.remove(ACCESS_TOKEN);
      this.$reset();
    },
    fetchLogin(payload: { username: string; password: string }) {
      return api.auth.login(payload).then(res => this.tokenSave(res.token));
    },
    fetchLogout() {
      this.tokenLogout();
      window.location.reload();
    },
  },
  persist: true,
});
