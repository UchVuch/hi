<template>
  <v-app>
    <app-bar @show="sidebarShow = !sidebarShow"></app-bar>
    <app-navigation v-model="sidebarShow"></app-navigation>
    <router-view></router-view>
  </v-app>
</template>
<script>
import AppBar from './components/AppBar.vue';
import AppNavigation from './components/AppNavigation.vue';

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
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
