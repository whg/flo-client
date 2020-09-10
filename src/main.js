import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

library.add(faUserSecret)

Vue.component('fai', FontAwesomeIcon)

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
      return s[0] + s.substr(1).toLowerCase()
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
