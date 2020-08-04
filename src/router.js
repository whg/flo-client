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
  },
  {
    path: '/log',
    name: 'log',
    component: () => import(/* webpackChunkName: "log" */ './views/Log.vue')
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import(/* webpackChunkName: "tree" */ './views/Tree.vue')
  },
  {
    path: '/test-bed',
    name: 'test-bed',
    component: () => import(/* webpackChunkName: "test-bed" */ './views/TestBed.vue')
  },
  {
    path: '/pods',
    name: 'pods',
    component: () => import(/* webpackChunkName: "pods" */ './views/Pods.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "pods" */ './views/Dashboard.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
