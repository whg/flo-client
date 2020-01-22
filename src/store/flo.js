import Vue from 'vue'
import socketio from 'socket.io-client'
import { camelToKebab, vocabMap } from '../util'

export const socketPlugin = ((socket) => {
  const prefix = 'flo/socket'
  const prefixRegex = new RegExp(prefix)
  const extract = name => camelToKebab(name.slice(prefix.length))

  return (store) => {
    Object.keys(store._mutations).forEach((funcName) => {
      if (prefixRegex.exec(funcName)) {
        const channel = extract(funcName)
        console.log(funcName, channel)
        socket.on(channel, (data) => {
          store.commit(funcName, data)
        })
      }
    })

    store.subscribeAction((action) => {
      if (prefixRegex.exec(action.type)) {
        const channel = extract(action.type)
        socket.emit(channel, action.payload)
      }
    })
  }
})(socketio('http://192.168.1.158:3000'))

export const flo = {
  namespaced: true,
  state: {
    components: [],
    sequences: {},
    instances: {},
    variables: {},
    groups: {},
    message: '',
    log: [],
    fead: {
      responses: [],
      online: [],
      requestingOnline: false
    },
    runPoints: {}
  },
  mutations: {
    socketConnect(state) {
      console.log('connect')
    },
    socketSequences(state, sequences) {
      state.sequences = sequences
      console.log('sequences', sequences)
    },
    socketInstances(state, instances) {
      state.instances = instances
      // console.log(instances)
    },
    socketGroups(state, groups) {
      state.groups = groups
      console.log('g', groups)
    },
    socketVariables(state, v) {
      console.log(v)
      state.variables = v
    },
    socketFeadRequest(state, payload) {
      const r = payload.request

      let request = `${r.method[0]}${r.address}:${vocabMap[r.param]}`
      if (r.value) {
        request += `:${r.value}`
      }

      if (r.extraValue) {
        request += `:${r.extraValue}`
      }
      payload.requestString = request
      payload.index = state.fead.responses.length
      state.fead.responses.unshift(payload)
    },
    socketFeadOnline(state, payload) {
      state.fead.online = payload
      state.fead.requestingOnline = false
    },
    socketRunning(state, payload) {
      const { id } = payload
      Vue.set(state.runPoints, id, payload)
      console.log(payload)
    },
    socketMessage(state, payload) {
      const { message } = payload
      state.message = message
      setTimeout(() => {
        state.message = null
      }, 2000)
      console.log('updated message', payload)
    },
    socketLog(state, line) {
      state.log.unshift(line)
    }
  },
  actions: {
    socketUpdateSequences() {},
    socketSaveSequences() {},
    socketUpdateVariables() {},
    socketSaveVariables() {},
    socketUpdateInstance() {},
    socketGetInstances() {},
    socketFeadRequest() {},
    socketFeadOnline({ state }) {
      state.fead.requestingOnline = true
    },
    socketPod() {
    }
  }
}
