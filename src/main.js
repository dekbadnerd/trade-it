import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'

import DashboardView from './views/DashboardView.vue'
import ProfileView from './views/ProfileView.vue'
import CreateTradeView from './views/CreateTradeView.vue'
import TradeRoomView from './views/TradeRoomView.vue'
import MiddlemanBoardView from './views/MiddlemanBoardView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardView },
  { path: '/profile', component: ProfileView },
  { path: '/create', component: CreateTradeView },
  { path: '/trade/:id', component: TradeRoomView, props: true },
  { path: '/middleman', component: MiddlemanBoardView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')
