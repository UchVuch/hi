import { createApp } from 'vue'
import { createPinia } from "pinia"
import vuetify from '@/plugins/vuetify'
import router from '@/plugins/router/router'
import App from '@/App.vue'
import '@/style.css'

const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount('#app')
