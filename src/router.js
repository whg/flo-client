import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/console',
    name: 'console',
    component: () => import(/* webpackChunkName: "console" */ './views/Console.vue')
  },
  {
    path: '/flo',
    name: 'flo',
    component: () => import(/* webpackChunkName: "flo" */ './views/Flo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
