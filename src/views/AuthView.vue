<template>
  <div class="h-100 d-flex flex-column align-center pt-16">
    <div class="w-50 d-flex flex-column justify-center">
      <v-form ref="authForm">
        <h2 class="text-h4 mb-5">Авторизация</h2>
        <v-text-field
          v-model="username"
          label="Введите логин"
          :rules="rules"
          hide-details="auto"
          autocomplete="new-password"
          class="mb-6"
        />
        <v-text-field
          v-model="password"
          label="Введите пароль"
          :rules="rules"
          hide-details="auto"
          class="mb-6"
          autocomplete="new-password"
          type="password"
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

<script>
import { login, getme, getRoles, getUser } from '../api'
import { mapActions } from 'pinia'
import {useAuthStore} from '@/plugins/store/auth'

export default {

  async created() {
    if (localStorage.getItem('username') && localStorage.getItem('password')) {

      const user = {
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password')
      }
      // если авторизация успешна переходим на основную страницу
      const status = await login(user)
      // console.log(status)
      if (status) {
        const user = await getme()
        const userId = user.slice(8)
        const userData = await getUser(userId)
        const roles = await getRoles()
        const accessRules = roles.find(role => role.id === userData.role_id)
        // const accessRules = {
        //   access_users: 2,
        //   access_keys: 0,
        //   access_tenders: 1,
        //   access_files: 1,
        // }
        // console.log(accessRules)
        this.authLogin(accessRules)
        this.$router.push('/home')
      } else {
        console.log('Ошибка')
      }

    } else {
      return
    }
  },

  data: () => ({
    rules: [
      value => !!value || 'Заполните поле ввода' 
    ],
    username: '',
    password: ''
  }),

  methods: {
    ...mapActions(useAuthStore, ['authLogin']),

    async postLogin() {
      const { valid } = await this.$refs.authForm.validate()
      
      if (valid) {
        const user = {
          username: this.username,
          password: this.password
        }
        // если авторизация успешна переходим на основную страницу
        const status = await login(user)
        // console.log(status)
        if (status) {
          const user = await getme()
          const userId = user.slice(8)
          const userData = await getUser(userId)
          const roles = await getRoles()
          const accessRules = roles.find(role => role.id === userData.role_id)
          // const accessRules = {
          //   access_users: 3,
          //   access_keys: 0,
          //   access_tenders: 1,
          //   access_files: 1,
          // }
          // console.log(accessRules)
          this.authLogin(accessRules)
          this.$router.push('/home')
        } else {
          console.log('Ошибка')
        }
      }    
    }
  }
}
</script>

<style scoped></style>