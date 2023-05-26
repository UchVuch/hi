<template>
    <v-app-bar
        v-if="isAuth && $route.name !== 'auth'"
        density="compact"
        :elevation="1"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="$emit('show')"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>WSB</v-app-bar-title>

        <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '@/plugins/store/auth';

export default {
  name: 'app-bar',
  data: () => ({
  }),
  
  computed: {
    ...mapState(useAuthStore, {
      isAuth: 'isAuth'
    })
  },

  methods: {
    ...mapActions(useAuthStore, ['authLogout']),
    logout() {
      this.authLogout()
      this.$router.push('/')
    },
  }
}
</script>
<style scoped>
</style>
