import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon'
import App from './App.vue'
import router from './router'
import store from './store'
import './icons'
import * as util from './util'

Vue.config.productionTip = false

Vue.component('fai', Icon)

Vue.mixin({
  methods: {
    grabKeys: (o, keys, initial) => {
      const output = initial || {}
      keys.forEach((k) => { output[k] = o[k] })
      return output
    },
    randomID: () => Math.random().toString(16).slice(2),
    toTitle: (t) => {
      const s = t.replace('_', ' ')
      return s[0].toUpperCase() + s.substr(1).toLowerCase()
    },
    camelToTitle: (t) => {
      const s = util.camelToSpace(t)
      return s[0].toUpperCase() + s.substr(1).toLowerCase()
    }
  }
})

Vue.use({
  install(v) {
    v.prototype.builtinFunctions = [
      'delay', 'set', 'get',
      'loop', 'if', 'nop', 'jump', 'log', 'end'
    ]
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
