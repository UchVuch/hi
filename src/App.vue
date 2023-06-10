<template>
  <v-app>
    <app-bar @show="sidebarShow = !sidebarShow"></app-bar>
    <app-navigation v-model="sidebarShow"></app-navigation>
    <router-view></router-view>
  </v-app>
</template>
<script>
import AppBar from './components/AppBar.vue'
import AppNavigation from './components/AppNavigation.vue'

export default {
  components: { AppBar, AppNavigation },
    mounted() {
      this.$router.push('/')
    },
    data: () => ({
        sidebarShow: true,
    }),
}
</script>
<style scoped>
</style>
