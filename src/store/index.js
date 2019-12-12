import Vue from 'vue'
import Vuex from 'vuex'
import { socketPlugin, flo } from './flo'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedElement: null
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    flo
  },
  plugins: [socketPlugin]
})
