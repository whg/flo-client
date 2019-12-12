import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    grabKeys: (o, keys, initial) => {
      const output = initial || {}
      keys.forEach((k) => { output[k] = o[k] })
      return output
    },
    randomID: () => Math.random().toString(16).slice(2)
  }
})

Vue.use({
  install(v) {
    v.prototype.builtinFunctions = [
      'delay', 'set', 'brif', 'nop', 'jump', 'log'
    ]
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
