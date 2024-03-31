<script setup>
import { logout } from '../../api'
import { useRouter, useRoute } from 'vue-router'
import { useAppTheme } from '@/composables/useAppTheme'
import { useWindowResize } from '@/composables/useWindowResize'
import { useSessionUserInfo } from '@/composables/useSessionUserInfo'

defineEmits(['show'])

const router = useRouter()
const route  = useRoute()
const { toggleTheme } = useAppTheme()
const { device } = useWindowResize()
const { isAuth, userName } = useSessionUserInfo()

async function getLogout() {
  await logout()
  router.push({name: 'home'})
}

// !!! ошибка при клике на смену темы
</script>
<template>
  <v-app-bar
    v-if="isAuth && route.name !== 'auth'"
    density="compact"
    :elevation="1"
  >
    <template #prepend>
      <v-app-bar-nav-icon @click="$emit('show')" />
    </template>

    <v-app-bar-title v-if="device === 'mobile'">
      ВСБ Администратор
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      icon
      @click="(e) => {
        e.preventDefault();
        toggleTheme()
      }"
    >
      <v-icon icon="mdi-theme-light-dark" />
    </v-btn>
    <span v-if="device === 'desktop'"> <v-icon icon="mdi-account" /> {{ userName }} </span>
    <span
      v-else
      class="app-title"
    >
      ВСБ Администратор
    </span>
    <v-btn
      class="ml-2"
      icon="mdi-logout"
      @click="getLogout"
    />
  </v-app-bar>
</template>
<style scoped>
.app-title {
  font-size: 18px;
  width: 190px;
}
</style>
