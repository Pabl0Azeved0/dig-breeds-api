import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import { lazyLoadDirective } from './directives/lazyLoad'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#34495E',
          secondary: '#5D6D7E',
        }
      }
    }
  }
})

const app = createApp(App)

app.use(vuetify)
app.directive('lazy-load', lazyLoadDirective)
app.mount('#app')