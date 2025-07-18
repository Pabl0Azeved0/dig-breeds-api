import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { lazyLoadDirective } from './directives/lazyLoad'

const app = createApp(App)

app.use(router)
app.directive('lazy-load', lazyLoadDirective);

app.mount('#app')