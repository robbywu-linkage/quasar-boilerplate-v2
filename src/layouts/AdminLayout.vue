<template>
  <q-page>
    <AdminLayout user-name="Admin" @logout="fetchLogout" bg-color="#f4f5f6">
      <template #left-drawer-header>
        <!-- Logo / Title -->
        <div class="flex items-center q-px-md">
          <div class="q-ml-xs text-weight-regular text-white">
            <span class="q-ml-sm" style="font-size: 1.3rem">Linkage Retail</span>
            <span class="q-ml-sm text-subtitle2">CMS</span>
          </div>
        </div>
      </template>
      <template #left-drawer-footer>
        <p>Version: 0.0.1</p>
      </template>
      <template #menu-list>
        <Menu v-model="home" />
        <Menu v-model="management" title="MANAGEMENT" />
      </template>
    </AdminLayout>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useAuthStore } from '../stores/auth-store';

export default defineComponent({
  setup() {
    const $storeAuth = useAuthStore();

    const { fetchLogout } = $storeAuth;

    return {
      home: ref([{ label: 'Dashboard', path: '', icon: 'o_home' }]),
      management: ref([
        {
          label: 'Order Mgmt',
          path: '',
          icon: 'o_shopping_cart',
          children: [
            { label: 'Allocation', path: '' },
            { label: 'Refund Orders', path: '' },
            { label: 'Orders History', path: '' },
          ],
        },
      ]),
      fetchLogout,
    };
  },
});
</script>
