<template>
  <v-navigation-drawer
    width="100%"
    v-if="isAuth && $route.name !== 'auth'"
    v-model="sidebarShow"
    permanent
  >
    <v-list nav width="12vw">
      <v-list-item prepend-icon="mdi-view-dashboard" title="Тендеры" value="dashboard"></v-list-item>
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
      isAuth: 'isAuth'
    })
  },
}
</script>
<style scoped>
/* .v-list-item { */
  /* grid-template-columns: 30px auto max-content; */
/* } */
</style>
