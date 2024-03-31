<script setup>
import { useRoute } from 'vue-router'
import { useWindowResize } from '@/composables/useWindowResize'
import { useSessionUserInfo } from '@/composables/useSessionUserInfo'

const route = useRoute()
const { device } = useWindowResize()
const { isAuth, access, userName } = useSessionUserInfo()
const navigationList = [
  {
    icon: 'mdi-file-document-outline',
    title: 'Договоры',
    value: 'home',
    to: 'home'
  },
  {
    icon: 'mdi-cash-multiple',
    title: 'Закупки',
    value: 'purchases',
    to: 'purchases'
  },
  {
    icon: 'mdi-face-agent',
    title: 'Поддержка',
    value: 'support',
    to: 'support'
  },
  {
    icon: 'mdi-checkbox-marked-circle-plus-outline',
    title: 'Задачи',
    value: 'todo',
    to: 'todo'
  },
  {
    icon: 'mdi-code-braces-box',
    title: 'Генератор',
    value: 'generator',
    to: 'generator'
  },
  {
    icon: 'mdi-folder',
    title: 'База данных',
    value: 'database',
    to: 'database'
  },
  {
    icon: 'mdi-account-group',
    title: 'Пользователи',
    value: 'users',
    to: 'users'
  },
  {
    icon: 'mdi-security',
    title: 'Администрирование',
    value: 'admin',
    to: 'admin'
  }
]
</script>
<template>
  <v-navigation-drawer
    v-if="isAuth && route.name !== 'auth'"
    width="100%"
    permanent
  >
    <v-list
      nav
      :width="device === 'mobile' ? '250px' : '200px'"
    >
      <div v-if="isAuth">
        <v-list-item prepend-icon="mdi-account">
          <span>{{ userName }}</span>
        </v-list-item>
      </div>
      <div 
        v-for="navigationItem in navigationList"
        :key="navigationItem.value"
      >
        <v-list-item 
          v-if="access[navigationItem.value] > 0"
          :prepend-icon="navigationItem.icon"
          :value="navigationItem.title"
          :to="navigationItem.to"
          exact-active-class="active"
        />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped>
.active {
  background-color: black;
}
.v-list-item {
  grid-template-columns: 30px auto max-content;
}
.v-list-item:hover {
  color: rgb(48, 79, 254);
}
</style>
