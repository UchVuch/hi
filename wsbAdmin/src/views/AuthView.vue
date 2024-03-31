<script setup>
import { customFetch, login, getme, getUser, getRoles } from '@/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionUserInfo } from '@/composables/useSessionUserInfo'

const router = useRouter()
const { setAuthAccess, setUserName } = useSessionUserInfo()
async function installationUserAuthInfo() {
  const keys = ['tenders', 'keys', 'users', 'files', 'purchases', 'support', 'todo', 'admin']
  const accessRules = {}
  const user = await getme()
  const userId = user.slice(8)
  const userData = await getUser(userId)
  const userName = `${userData.name} — ${userData.username}`
  const { rules } = await customFetch(this, getRoles, userData.role_id)
  keys.forEach(key => {
    const value = rules[key]
    value ? accessRules[key] = value : accessRules[key] = 0
  })
  setAuthAccess(accessRules, Number(userId))
  setUserName(userName)
  router.push({name: 'home'})
}

async function authorizationUsingLocalStorage() {
  if (localStorage.getItem('username') && localStorage.getItem('password')) {
    const user = {
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password')
    }
    const status = await login(user)
    if (status) {
      installationUserAuthInfo()
    } else {
      console.log('Ошибка')
    } 
  }
}
authorizationUsingLocalStorage()

const rules = [
  value => !!value || 'Заполните поле ввода' 
]
const username = ref('')
const password = ref('')
const authForm = ref(null)
async function postLogin() {
  const { valid } = await authForm.value.validate()
  if (valid) {
    const user = {
      username: username.value,
      password: password.value
    }
    const status = await login(user)
    if (status) {
      installationUserAuthInfo()
    } else {
      console.log('Ошибка')
    }
  }    
}
</script>
<template>
  <div class="h-100 d-flex flex-column align-center pt-16">
    <div class="w-50 d-flex flex-column justify-center">
      <v-form ref="authForm">
        <h2 class="text-h4 mb-5">
          Авторизация
        </h2>
        <v-text-field
          v-model="username"
          label="Введите логин"
          :rules="rules"
          hide-details="auto"
          class="mb-6"
          autocomplete="new-password"
          @keyup.enter="postLogin"
        />
        <v-text-field
          v-model="password"
          label="Введите пароль"
          :rules="rules"
          hide-details="auto"
          class="mb-6"
          autocomplete="new-password"
          type="password"
          @keyup.enter="postLogin"
        />
        <v-btn 
          block
          color="primary py-6 d-flex"
          @click="postLogin"
        >
          Войти
        </v-btn>
      </v-form>
    </div>
  </div>
</template>