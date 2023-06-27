<template>
  <v-app :class="{ 'padding-left--active': sidebarShow && $route.name !== 'home', 'padding-left': !sidebarShow }">
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
      console.log(this.name)
    },
    data: () => ({
        sidebarShow: true,
    }),
}
</script>
<style scoped>
.padding-left--active {
  padding-left: 200px;
  transition: padding 0.3s ease;
}
.padding-left {
  padding-left: 0px;
  transition: padding 0.3s ease;
}
</style>