<template>
    <v-navigation-drawer
      v-if="isAuth && $route.name !== 'auth'"
      v-model="sidebarShow"
      permanent
    >
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Тендеры" value="dashboard"></v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '@/plugins/store/auth';

export default {
  name: 'app-navigation',
  data: () => ({
  }),
  computed: {
    ...mapState(useAuthStore, {
      isAuth: 'isAuth'
    })
  },
}
</script>
<style scoped>
</style>
