<template lang="html">
<div class="">
  <h3>Power</h3>
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
  <table>
    <thead>
      <th>Branch</th>
      <th>Pod</th>
      <th>Status</th>
      <th>Power</th>
      <th>Settings</th>
      <th>Test</th>
      <!-- <th>Enabled</th> -->
      <!-- <th>Squeezes / hour</th> -->
      <!-- <th>Bubbles / hour</th> -->
      <th></th>
    </thead>
    <tbody>
      <tr v-for="pod in pods" :key="pod.channel">
        <td>{{ pod.channel }}</td>
        <td>{{ pod.uid || '-' }}</td>
        <td class="center">
          <i v-if="!pod.on" class="status offline"></i>
          <spinner v-else-if="pod.on && !pod.uid" />
          <i v-else-if="pod.on && pod.uid" class="status online"></i>
        </td>
        <td>
          <button :disabled="!allowRequest" @click="togglePower(pod)">
            <fai name="power-off" />
            {{ pod.on ? 'off' : 'on' }}
          </button>
        </td>
        <td class="center">
          <span class="pointer" @click="selectPod(pod, 'settings')">
            <fai name="cog" />
          </span>
        </td>
        <td class="center">
          <span class="pointer" @click="selectPod(pod, 'test')">
            <fai name="vial" />
          </span>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="selectedPod" class="">
    <h3>{{ selectedPod }}</h3>
    <span @click="powerPod(selectedPod, true)">Power on</span>
    <span @click="powerPod(selectedPod, false)">Power off</span>
  </div>

  <modal v-if="selectedPod && selectedPod.window === 'settings'"
         @close="selectedPod = null" class="pod-modal">
    <h4>Branch {{ selectedPod.channel }}
      <span v-if="selectedPod.uid" class="pod-no">Pod {{ selectedPod.uid }}</span>
    </h4>
    <div class="buttons">
      <button @click="controlPod('squeeze')">squeeze</button>
    </div>
    <table v-if="selectedPod.settings">
      <tr v-for="setting in selectedPod.settings" :key="setting.param">
        <td>
          {{ settingName(setting) }}
        </td>
        <td class="adjust">
          <span class="pointer" @click="setting.value--; updateSetting(setting)">
            <fai name="minus" />
          </span>
          <input type="number" v-model="setting.value" @change="updateSetting(setting)" />
          <span class="pointer" @click="setting.value++; updateSetting(setting)">
            <fai name="plus" />
          </span>
        </td>
      </tr>
    </table>
    <div v-else class="no-table">
      <spinner v-if="selectedPod.on"></spinner>
      <span v-else>No Pod</span>
    </div>
    <div v-if="selectedPod.settings" class="end-buttons">
      <button class="danger" @click="revertSettings">
        <fai name="history" />
        revert
      </button>
      <button class="primary" @click="selectedPod = null">
        <fai name="check" />
        apply
      </button>
    </div>
  </modal>
  <modal v-if="selectedPod && selectedPod.window === 'test'"
         @close="selectedPod = null" class="pod-modal">
    <h4>Branch {{ selectedPod.channel }}
      <span v-if="selectedPod.uid" class="pod-no">Pod {{ selectedPod.uid }}</span>
    </h4>
    <div>
      <div class="buttons">
        <button class="test" @click="controlPod('testWater')">send water</button>
      </div>
      <div class="buttons">
        <button class="test" @click="controlPod('testSoapOn')">start soap</button>
        <button class="test" @click="controlPod('testSoapOff')">stop soap</button>
      </div>
      <div v-if="selectedPod.on">
        <div class="buttons">
          <button @click="controlPod('blow')">blow</button>
          <button @click="controlPod('squeeze')">squeeze</button>
        </div>
        <div class="test-request">
          <button :class="{ stop: testRequesting === 'waterLevel' }"
                  @click="togglePodRequest('waterLevel')">
            request water level
          </button>
          <span>{{ testRequests.waterLevel }}</span>
        </div>
        <div class="test-request">
          <button :class="{ stop: testRequesting === 'sensor' }"
                  @click="togglePodRequest('sensor')">
            test bubble sensor
          </button>
          <span>
            <fai v-if="testRequests.sensor === 'not-over'" name="regular/circle" />
            <fai v-if="testRequests.sensor === 'over'" name="circle" />
          </span>
        </div>
      </div>
      <div v-else class="no-table">
        <span>No Pod</span>
      </div>
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
      lastContacts: {},
      testRequesting: null,
      testRequests: {
        waterLevel: null,
        sensor: null,
        interval: null
      }
    }
  },
  computed: {
    ...mapGetters('flo', ['allowRequest']),
    ...mapState('flo', ['runningSequences'])
  },
  watch: {
    selectedPod() {
      if (this.testRequesting) {
        this.togglePodRequest(this.testRequesting)
      }
    }
  },
  methods: {
    ...mapActions('flo', ['floRequest']),
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
    selectPod(pod, window) {
      this.selectedPod = { ...pod, window }
      if (this.selectedPod.on) {
        this.floRequest({
          command: 'podSettings',
          args: {
            channel: pod.channel
          }
        }).then((settings) => {
          this.$set(this.selectedPod, 'settings', settings)
          this.cachedSettings = JSON.parse(JSON.stringify(settings))
          this.changedSettings = {}
        })
      }
    },
    settingName(setting) {
      let name = this.toTitle(vocabMap[setting.param])
      if (name === 'Duty cycle') {
        name = 'Soap duty'
      }
      return name
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
    controlPod(func) {
      const { channel } = this.selectedPod
      this.floRequest({
        command: 'controlPod',
        args: {
          channel, func
        }
      })
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
    },
    togglePodRequest(test) {
      if (this.testRequesting === test) {
        clearInterval(this.testRequests.interval)
        this.$set(this.testRequests, this.testRequesting, null)
        this.testRequesting = null
      } else {
        this.testRequesting = test
        this.testRequests.interval = setInterval(() => {
          this.floRequest({
            command: 'testPodRequest',
            args: {
              channel: this.selectedPod.channel,
              test
            }
          }).then((value) => {
            if (this.testRequesting) {
              this.$set(this.testRequests, test, value)
            }
          })
        }, 250)
      }
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

.pod-modal {
  table {
    th {
      text-align: left;
      font-size: 2rem;
      color: #333;
    }

    td:first-child {
      padding-left: 5px;
    }
    td:not(:first-child) {
      text-align: center;
    }
    td {
      padding: 10px;
      button {
        width: 100%;
      }
    }

    input[type="checkbox"] {
      height: unset !important;
      margin: 0;
    }
  }

  .no-table {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
  }

  .pod-no {
    color: #888;
    font-size: 20px;
    padding-left: 10px;
  }

  .buttons {
    text-align: center;
    /* margin-bottom: 20px; */
    button {
      margin: 0 10px 20px 10px;
    }
  }

  .test-request {
    margin-bottom: 20px;
    span {
      font-weight: bold;
      margin-left: 10px;
      svg {
        width: 20px;
        height: 20px;
        margin-bottom: -4px;
      }
    }
  }

  .end-buttons {
    display: flex;
    justify-content: space-between;
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

button svg.fa-icon {
  margin-bottom: -2px;
  margin-right: 4px;
}

.fa-icon {
  color: #555;
}

</style>
