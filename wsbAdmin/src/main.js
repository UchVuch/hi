import { createApp } from 'vue'
import vuetify from '@/plugins/vuetify'
import router from '@/plugins/router'
import App from '@/App.vue'

import '@/style.css'

const app = createApp(App).use(vuetify).use(router)

app.mount('#app')
