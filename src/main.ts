import './assets/main.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import ECharts from 'vue-echarts'
import 'echarts'

import gbEn from './locales/gb-en.json'
import viVn from './locales/vi-vn.json'

const pinia = createPinia()
const app = createApp(App)
const savedLocale = localStorage.getItem('locale') || 'gb-en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale, // default locale
  fallbackLocale: 'gb-en',
  messages: {
    'gb-en': gbEn,
    'vi-vn': viVn,
  },
})

app.component('v-chart', ECharts)
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(VueApexCharts)

app.mount('#app')
