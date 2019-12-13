<template lang="html">
<div class="fead">
  <h2><tt>fead</tt>Console</h2>
  <p>
    <spinner v-if="requestingOnline"/>
    <span v-else>
      {{ online.length }} slave{{ online.length === 1 ? '' : 's' }} online
      <a @click="getOnline">refresh</a>
    </span>
  </p>
  <div class="controls">
    <select v-model="method">
      <option value="get">GET</option>
      <option value="set">SET</option>
    </select>
    <select v-model="address">
      <option v-for="slave in online" :key="slave.uid"
              :value="slave.address">
        {{ slave.address }}
      </option>
    </select>
    <select v-model="param">
      <option v-for="[param, index] in vocabList" :key="index"
              :value="index">
        {{ param }}
      </option>
    </select>
    <template v-if="method !== 'get'">
      <select v-if="argMeta.options" v-model="value">
        <option v-for="option in argMeta.options" :key="option.value"
                :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <input v-else-if="argMeta.count > 0" type="text" v-model="value" @keydown.enter="send">
    </template>

    <input v-if="hasExtra" type="text" v-model="extraValue" @keydown.enter="send">
  </div>
  <button class="send slim" @click="send" :disabled="invalidInput">
    send
  </button>
  <div class="saved">
    <button v-for="request in saved" :key="request.name" @click="send(request)">
      {{ request.name }}
    </button>
  </div>
  <div class="responses">
    <table>
      <thead>
        <tr>
          <th>Request</th>
          <th>Response</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="response in responses" :key="response.index">
          <td>{{ response.requestString }}</td>
          <td v-if="response.error" class="error">{{ response.error }}</td>
          <td v-else>{{ response.value }} {{ response.extraValue }}</td>
          <td><a @click="reload(response.request)">edit</a></td>
          <td><a @click="send(response.request)">send</a></td>
          <td><a @click="save(response.request)">save</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { vocab, vocabMeta } from '@/vocab'
import { vocabMap } from '@/util'
import Spinner from '@/components/util/Spinner.vue'

export default {
  components: {
    Spinner
  },
  data() {
    return {
      method: 'get',
      address: 1,
      param: 0,
      value: '',
      extraValue: null,
      saved: []
    }
  },
  computed: {
    vocabList() {
      return Object.entries(vocab).sort(([a, i], [b, j]) => {
        return i - j
      })
    },
    invalidInput() {
      return this.method === 'set' && this.value !== '' && isNaN(parseFloat(this.value))
    },
    argMeta() {
      const paramName = vocabMap[this.param]
      return vocabMeta[paramName]
    },
    hasExtra() {
      return this.argMeta.count === 2 || (this.argMeta.count > 1 && this.method === 'get')
    },
    ...mapState('flo', {
      responses: (state) => state.fead.responses,
      online: (state) => state.fead.online,
      requestingOnline: (state) => state.fead.requestingOnline
    })
  },
  methods: {
    ...mapActions('flo', {
      sendFead: 'socketFeadRequest',
      getOnline: 'socketFeadOnline'
    }),
    send(request) {
      if (request && request.altKey === undefined) {
        this.reload(request)
      }
      const { method, address, param } = this
      const payload = { method, address, param }
      if (method === 'set') {
        payload.value = parseFloat(this.value)
      }
      if (this.hasExtra) {
        payload.extraValue = parseFloat(this.extraValue)
      }
      this.sendFead(payload)
    },
    reload(request) {
      this.method = request.method
      this.address = request.address
      this.param = request.param
      this.value = request.value
      this.extraValue = request.extraValue
      // this.hasExtra = request.extraValue !== undefined
    },
    save(request) {
      const name = window.prompt('What do you want to call the request?')
      if (name) {
        this.saved.push(Object.assign({}, request, { name }))
      }
    }
  },
  mounted() {
    this.getOnline()
  }
}
</script>

<style lang="scss" scoped>
div.fead {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;

  h2 {
    tt {
      font-size: 30px;
      font-weight: bold;
   }
  }
  .controls {
    margin: 20px 0;
  }
}
input[type="text"] {
  width: 75px;
}

input.address {
  width: 50px;
}

span.extra {
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
}

.send {
  // margin: 10px;
}

.saved {
  text-align: left;
  padding: 10px;
}

.responses {
  table {
    margin: 20px auto;
    min-width: 50%;
    tbody {
      td:first-child {
        color: #666;
        font-family: monospace;
        font-size: 14px;
      }
    }
    td.error {
      color: #c33;
    }
  }
}

</style>
