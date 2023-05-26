<template>
  <div class="h-100 d-flex flex-column align-center pt-16">
    <div class="w-50 d-flex flex-column justify-center">
      <v-form ref="authForm">
        <h2 class="text-h4 mb-5">Авторизация</h2>
        <v-text-field
          label="Введите логин"
          :rules="rules"
          hide-details="auto"
          autocomplete="new-password"
          class="mb-6"
        />
        <v-text-field
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
          @click="login"
        >
          Войти
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import {useAuthStore} from '@/plugins/store/auth';

export default {

  data: () => ({
    rules: [
      value => !!value || 'Заполните поле ввода' 
    ],
  }),

  methods: {
    ...mapActions(useAuthStore, ['authLogin']),
    async login() {
      const { valid } = await this.$refs.authForm.validate()
      
      if (valid) {
        this.authLogin()
        this.$router.push('/home')
      }    
    }
  }
}
</script>

<style lang="scss" scoped></style>