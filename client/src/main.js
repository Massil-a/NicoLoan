import './assets/style.css'

import { createApp } from 'vue'
import App from './views/App.vue'
import store from './store/store'
import VueCookies from 'vue-cookies'
import router from './utils/router'

createApp(App)
  .use(VueCookies) //intégration vue-cookies
  .use(store) // intégration Vuex
  .use(router) // intégration vue-router
  .mount('#app')
