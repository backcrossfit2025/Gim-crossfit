import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { router } from './routes/routes.js'
import { Quasar, Dialog, Notify, Dark } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import 'quasar/dist/quasar.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(Quasar, { plugins: { Dialog, Notify, Dark } })
app.use(pinia)
app.use(router)
app.mount('#app')
