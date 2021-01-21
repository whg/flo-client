import Vue from 'vue'
import Vuex from 'vuex'
import { socketPlugin, flo } from './flo'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedElement: null,
    admin: false
  },
  mutations: {
    authenticate(state) {
      state.admin = true
    }
  },
  actions: {
  },
  modules: {
    flo
  },
  plugins: [socketPlugin]
})
