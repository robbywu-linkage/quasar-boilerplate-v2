import { api } from '../boot/axios';

export default {
  /**
   * 登入系統
   */
  login(payload: { username: string; password: string }) {
    return api.post('/api/authenticate', payload);
  },
};
