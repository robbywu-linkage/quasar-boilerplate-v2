<template>
  <q-layout style="background: #e0e5eb">
    <Login
      section-left-class="bg-primary"
      title="Linkage Retail CMS"
      subtitle="BACKEND MANAGEMENT SYSTEM"
      version="Version: 0.0.1"
      :model-type="modelType"
      @login="onLogin"
      @sendEmail="onForget"
      @resetPassword="onResetPassword"
    >
      <template #logo>
        <img src="~assets/quasar-logo-vertical.svg" height="45px" />
      </template>
    </Login>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../stores/auth-store';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const $storeAuth = useAuthStore();

    const { fetchLogin } = $storeAuth;

    const modelType = ref('');

    const onLogin = (payload: any) => {
      fetchLogin(payload)
        .then(() => $router.replace('/'))
        .catch(error => $q.notify({ type: 'negative', message: error.message }));
    };

    const onForget = (payload: any) => {
      console.log('onForget', payload);
    };

    const onResetPassword = (payload: any) => {
      console.log('onResetPassword', payload);
    };

    return {
      modelType,
      onLogin,
      onForget,
      onResetPassword,
    };
  },
});
</script>
