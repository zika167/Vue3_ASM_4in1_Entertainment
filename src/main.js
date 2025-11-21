import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS và JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import custom styles
import './assets/styles/main.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
