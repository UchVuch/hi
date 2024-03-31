<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MainHeader from '@/components/layouts/MainHeader.vue'
import MainSidebar from '@/components/layouts/MainSidebar.vue'

const route = useRoute()
watch(
  () => route.name, 
  () => _sidevarShow.value = false
)

const _sidevarShow = ref(false)
</script>

<template>
  <v-app
    :class="{
      'padding-left--active': _sidevarShow && route.name !== 'home',
      'padding-left': !_sidevarShow,
    }"
  >
    <main-header
      v-if="true"
      @show="_sidevarShow = !_sidevarShow"
    />
    <main-sidebar v-model="_sidevarShow" />
    <router-view />
  </v-app>
</template>

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
