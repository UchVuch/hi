import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      isAuth: false,
      access: {
        users: 1,
        keys: 1,
        tenders: 1,
        files: 1,
        purchases: 1,
      }
    }
  },
  getters: {
    getIsAuth: (state) => state.isAuth,
    getAccess: (state) => state.access
  },
  actions: {
    authLogin(data) {
      this.isAuth = true
      this.access = {
        users: data.access_users,
        keys: data.access_keys,
        tenders: data.access_tenders,
        files: data.access_files,
        purchases: data.access_purchases,
      }
    },
    authLogout() {
      this.isAuth = false
      this.access = {
        users: 1,
        keys: 1,
        tenders: 1,
        files: 1,
      }
    }
  }
})