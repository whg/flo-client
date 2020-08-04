
import Vue from 'vue'
import socketio from 'socket.io-client'
import { camelToKebab, vocabMap, sameRequest, randomID } from '../util'

export const socketPlugin = ((socket) => {
  const prefix = 'flo/socket'
  const prefixRegex = new RegExp(prefix)
  const extract = name => camelToKebab(name.slice(prefix.length))

  return (store) => {
    store.state.flo.socket = socket

    Object.keys(store._mutations).forEach((funcName) => {
      if (prefixRegex.exec(funcName)) {
        const channel = extract(funcName)
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
})(socketio('http://192.168.43.16:3000'))
// })(socketio('http://192.168.1.158:3000'))
// })(socketio('http://192.168.1.2:3000'))

export const flo = {
  namespaced: true,
  state: {
    socket: null,
    components: [],
    sequences: {},
    instances: {},
    variables: {},
    groups: {},
    message: '',
    state: {},
    log: [],
    fead: {
      collectResponses: false,
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
      // payload: { { method, address, ...}: request, int: value }
      if (state.fead.collectResponses) {
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
      }
    },
    socketFeadOnline(state, payload) {
      state.fead.online = payload
      state.fead.requestingOnline = false
    },
    socketRunning(state, payload) {
      const { id } = payload
      Vue.set(state.runPoints, id, payload)
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
    },
    socketState(state, payload) {
      state.state = payload
      console.log('state =', payload)
    }
  },
  actions: {
    socketUpdateSequences() {},
    socketSaveSequences() {},
    socketUpdateVariables() {},
    socketSaveVariables() {},
    socketUpdateInstance() {},
    socketGetInstances() {},
    socketRun() {},
    socketFeadRequest({ state }) {
      // state.fead.appendResponse = false
      // state.fead.nextResponse = null
      // console.log('sending', arguments[1])
      // return new Promise((resolve) => {
      //   const interval = setInterval(() => {
      //     if (state.fead.nextResponse) {
      //       console.log('resolving')
      //       clearInterval(interval)
      //       const response = state.fead.nextResponse
      //       state.fead.nextResponse = null
      //       state.fead.appendResponse = true
      //       resolve(response)
      //     }
      //   }, 10)
      // })
    },
    feadRequest({ state }, req) {
      return new Promise((resolve) => {
        state.socket.emit('fead-request', req)
        function handler({ request, value }) {
          if (sameRequest(req, request)) {
            state.socket.removeEventListener('fead-request', handler)
            resolve(value)
          }
        }
        state.socket.on('fead-request', handler)
      })
    },
    socketFeadOnline({ state }) {
      state.fead.requestingOnline = true
    },
    floRequest({ state }, reqOrCommand) {
      let req = { id: randomID() }
      console.log('sending', req, reqOrCommand)
      if (typeof reqOrCommand === 'string') {
        req.command = reqOrCommand
      } else { // assume object
        req = Object.assign(req, reqOrCommand)
      }
      return new Promise((resolve) => {
        state.socket.emit('request', req)
        state.socket.once(`response-${req.id}`, ({ request, response }) => {
          resolve(response)
        })
      })
    }
    // socketPod() {},
    // socketState() {},
    // socketControl() {}
  }
}
