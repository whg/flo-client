import socketio from 'socket.io-client'
import { camelToKebab, vocabMap } from '../util'

export const socketPlugin = ((socket) => {
  const prefix = 'socket'
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
})(socketio('http://localhost:3000'))

export const flo = {
  namespaced: true,
  state: {
    fead: {
      responses: [],
      online: [],
      requestingOnline: false
    }
  },
  mutations: {
    socketConnect(state) {
      console.log('connect')
    },
    socketGo(state, message) {
      console.log('gooo', message)
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
    }
  },
  actions: {
    socketTest({ commit }, payload) {
      console.log('calling with', payload)
    },
    socketFeadRequest() {},
    socketFeadOnline({ state }) {
      state.fead.requestingOnline = true
    },
    socketPod() {}
  }
}
