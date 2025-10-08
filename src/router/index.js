// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Pages/Home.vue'
import Message from '../Pages/Message.vue'
import MonitorLamaran from '../Pages/MonitorLamaran.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/message', name: 'message', component: Message },
  { path: '/monitorLamaran', name: 'monitorLamaran', component: MonitorLamaran },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
