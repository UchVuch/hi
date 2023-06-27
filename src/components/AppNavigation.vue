<template>
  <v-navigation-drawer
    width="100%"
    v-if="isAuth && $route.name !== 'auth'"
    permanent
  >
    <v-list nav width="200px">
      <div  v-if="access.tenders > 0"><v-list-item prepend-icon="mdi-view-dashboard"  title="Тендеры" value="home" :to="'home'"></v-list-item></div>
      <div  v-if="access.keys > 0"><v-list-item prepend-icon="mdi-code-braces-box"  title="Генератор" value="generator" :to="'generator'" ></v-list-item></div>
      <div  v-if="access.files > 0"><v-list-item prepend-icon="mdi-folder"  title="База данных" value="database" :to="'database'" ></v-list-item></div>
      <div  v-if="access.users > 0"><v-list-item prepend-icon="mdi-account-group"  title="Пользователи" value="users" :to="'users'"></v-list-item></div>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/plugins/store/auth'

export default {
  name: 'app-navigation',
  data: () => ({
  }),

  computed: {
    ...mapState(useAuthStore, {
      isAuth: 'isAuth',
      access: 'access'
    })
  },
}
</script>
<style scoped>
.v-list-item {
  grid-template-columns: 30px auto max-content;
}
.v-list-item:hover {
    color: rgb(48,79,254);
}
</style>