import Vue from 'vue'
import VueRouter from 'vue-router'
import Flo from './views/Flo.vue'
import Dashboard from './views/Dashboard.vue'
import store from './store'

Vue.use(VueRouter)

const guards = {
  onlyAdmin(to, from, next) {
    if (store.state.admin) {
      next()
    } else {
      next({ name: 'auth', params: { nextPage: to.name } })
    }
  }
}

const routes = [
  {
    path: '/auth/:nextPage?',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ './views/Auth.vue'),
    props: true
  },
  {
    path: '/console',
    name: 'console',
    component: () => import(/* webpackChunkName: "console" */ './views/Console.vue'),
    beforeEnter: guards.onlyAdmin
  },
  {
    path: '/flo',
    name: 'flo',
    component: Flo,
    beforeEnter: guards.onlyAdmin
  },
  {
    path: '/log',
    name: 'log',
    component: () => import(/* webpackChunkName: "log" */ './views/Log.vue'),
    beforeEnter: guards.onlyAdmin
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
    alias: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: Dashboard,
    beforeEnter: guards.onlyAdmin
  },
  {
    path: '/maintain',
    name: 'maintenance',
    component: () => import(/* webpackChunkName: "maintain" */ './views/Maintenance.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
