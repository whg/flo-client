<template lang="html">
<div class="">
  <h3>Power</h3>
  {{ addresses }}
  <table>
    <thead>
      <th>Address</th>
      <th>Target</th>
      <th>Last contact</th>
    </thead>
    <tbody>
      <tr v-for="obj in addresses" :key="obj.address">
        <td>{{ obj.address }}</td>
        <td>{{ obj.target ? toTitle(obj.target) : 'Pod' }}</td>
        <td>{{ lastContacts[obj.address] }}</td>
      </tr>
    </tbody>
  </table>

  <h3>Pods</h3>
  {{ JSON.stringify(runningSequences) }}
  <table>
    <thead>
      <th>Branch</th>
      <th>Pod</th>
      <th>Status</th>
      <th></th>
      <!-- <th>Enabled</th> -->
      <!-- <th>Squeezes / hour</th> -->
      <!-- <th>Bubbles / hour</th> -->
      <th></th>
    </thead>
    <tbody>
      <tr v-for="pod in pods" :key="pod.channel">
        <td>{{ pod.channel }}</td>
        <td>{{ pod.uid || '-' }}</td>
        <td>
          <i v-if="!pod.on" class="status offline"></i>
          <spinner v-else-if="pod.on && !pod.uid" />
          <i v-else-if="pod.on && pod.uid" class="status online"></i>
        </td>
        <!-- <td>
             {{ pod.enabled ? '✓' : '-' }}
             </td> -->
        <td>
          <button :disabled="!allowRequest" @click="togglePower(pod)">
            Power {{ pod.on ? 'off' : 'on' }}
          </button>
        </td>
        <td>
          <spinner v-if="selectedPod === pod && !selectedPod.settings" />
          <a v-else-if="pod.on" @click="selectPod(pod)">edit</a>
          <span v-else class="grayed">edit</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="selectedPod" class="">
    <h3>{{ selectedPod }}</h3>
    <span @click="powerPod(selectedPod, true)">Power on</span>
    <span @click="powerPod(selectedPod, false)">Power off</span>
  </div>

  <modal v-if="selectedPod && selectedPod.settings" @close="selectedPod = null" class="settings">
    <h5>Pod {{ selectedPod.channel }}</h5>
    <table v-if="selectedPod.settings">
      <tr v-for="setting in selectedPod.settings" :key="setting.param">
        <td>
          {{ settingName(setting) }}
        </td>
        <td class="adjust">
          <input type="number" v-model="setting.value" @change="updateSetting(setting)" />
          <span class="pointer" @click="setting.value--; updateSetting(setting)">-</span>
          <span class="pointer" @click="setting.value++; updateSetting(setting)">+</span>
        </td>
      </tr>
    </table>
    <div class="buttons">
      <button class="secondary" @click="revertSettings">revert</button>
      <button class="primary" @click="selectedPod = null">apply</button>
    </div>
  </modal>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Spinner from '@/components/util/Spinner.vue'
import Modal from '@/components/util/Modal.vue'
import { vocabMap } from '@/vocab'

export default {
  components: {
    Spinner,
    Modal
  },
  data() {
    return {
      pods: {},
      addresses: [],
      stateInterval: null,
      contactInterval: null,
      selectedPod: null,
      cachedSettings: null,
      changedSettings: null,
      lastContacts: {}
    }
  },
  computed: {
    ...mapGetters('flo', ['allowRequest']),
    ...mapState('flo', ['runningSequences'])
    // ...mapState('flo', ['state']),
    // ...mapState('flo', {
    //   pods: (store) => {
    //     const { pods } = store.state
    //     if (pods) {
    //       return Object.values(store.state.pods).sort((a, b) => a.channel - b.channel)
    //     }
    //     return []
    //   }
    // })
  },
  methods: {
    ...mapActions('flo', ['floRequest']),
    ...mapActions('flo', {
      // getState: 'socketState',
      // sendControl: 'socketControl',
      // run: 'socketRun'
    }),
    startStateInterval() {
      clearTimeout(this.stateInterval)
      this.floRequest('state').then((state) => {
        this.pods = state.pods
        this.addresses = state.addresses
        this.stateInterval = setTimeout(() => {
          this.startStateInterval()
        }, 1000)
      })
    },
    startContactInterval() {
      clearTimeout(this.contactInterval)
      this.floRequest('lastContact').then((data) => {
        Object.entries(data).forEach(([addr, t]) => {
          const d = new Date(t)
          this.lastContacts[addr] = `${d.toLocaleTimeString()} ${d.toLocaleDateString()}`
        })
        this.contactInterval = setTimeout(() => {
          this.startContactInterval()
        }, 5000)
      })
    },
    togglePower(pod) {
      this.floRequest({
        command: 'powerPod',
        args: {
          channel: pod.channel,
          value: !pod.on
        }
      })
    },
    podStatus(pod) {
      if (pod.enabled) {
        if (pod.address) {
          return 'online'
        } else if (pod.on) {
          return 'registering'
        } else {
          return 'offline'
        }
      }
      return 'notenabled'
    },
    selectPod(pod) {
      this.selectedPod = pod
      this.floRequest({
        command: 'podSettings',
        args: {
          channel: pod.channel
        }
      }).then((settings) => {
        this.selectedPod.settings = settings
        this.cachedSettings = JSON.parse(JSON.stringify(settings))
        this.changedSettings = {}
      })
    },
    settingName(setting) {
      return this.toTitle(vocabMap[setting.param])
    },
    updateSetting(setting) {
      const { channel } = this.selectedPod
      const { param, value } = setting
      this.floRequest({
        command: 'updatePodSetting',
        args: {
          channel, param, value
        }
      })
      this.changedSettings[param] = true
    },
    revertSettings() {
      const { channel } = this.selectedPod
      Object.keys(this.changedSettings).forEach((s) => {
        const { param, value } = this.cachedSettings[s]
        this.floRequest({
          command: 'updatePodSetting',
          args: {
            channel, param, value
          }
        })
      })
      this.selectedPod = null
    }
  },
  created() {
    this.startStateInterval()
    this.startContactInterval()
    // this.getState()
    // this.interval = setInterval(() => this.getState(), 1000)
  },
  beforeDestroy() {
    // clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
table {
  td:first-child {
    padding-left: 5px;
  }
  td:not(:first-child) {
    text-align: center;
  }
  input[type="checkbox"] {
    height: unset !important;
    margin: 0;
  }
}

$statusSize: 12px;
i.status {
  width: $statusSize * 2.6;
  height: $statusSize;
  background: #bbb;
  display: inline-block;
  border-radius: $statusSize / 3;

  &.online {
    background: #1c2;
  }
  &.offline {
    background: #f00;
  }
}

.adjust {
  input {
    width: 5em;
  }

  span {
    font-size: 20px;
    font-weight: bold;
    padding: 0 10px;
  }
}

.grayed {
  color: #aaa;
  opacity: 0.5;
  &:hover {
    cursor: not-allowed;
  }
}

</style>
