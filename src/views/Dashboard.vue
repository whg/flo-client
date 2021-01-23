<template lang="html">
<div class="">
  <header>
    <h1>Bubble Tree</h1>
    <span v-if="isConnected" class="run-time">Running for {{ runningHours }} hours</span>
    <h1 v-if="isRunning === null">Not connected</h1>
    <button v-else-if="isRunning === false"
            class="start-stop start" @click="setRunning('start')">Start</button>
    <button v-else class="start-stop" @click="setRunning('stop')">Stop</button>
  </header>
  <div v-if="fault">
    <h3 class="fault">{{ fault }}</h3>
  </div>
  <table v-else-if="isRunning !== null" class="pod-table">
    <thead>
      <th>Branch</th>
      <th>Pod</th>
      <th>Status</th>
      <th>Power</th>
      <th>Settings</th>
      <th>Test</th>
    </thead>
    <tbody>
      <tr v-for="pod in pods" :key="pod.channel">
        <td>{{ pod.channel }}</td>
        <td>{{ pod.uid || '-' }}</td>
        <td class="center">
          <fai v-if="pod.status === 'unresponsive'" name="exclamation-triangle"
               @click="errorMessage = 'No response from pod'" :title="pod.status" />
          <fai v-else-if="pod.status === 'leak-detected'" name="exclamation-triangle"
               @click="errorMessage = 'Leak condition detected, check water.'" :title="pod.status" />
          <fai v-else-if="pod.status === 'discover-fail'" name="exclamation-triangle"
               @click="errorMessage = 'Unable to communicate with pod'" :title="pod.status" />
          <i v-else-if="!pod.enabled" class="status disabled"></i>
          <i v-else-if="!pod.on" class="status offline"></i>
          <spinner v-else-if="pod.on && !pod.uid" />
          <i v-else-if="pod.on && pod.uid" class="status online"></i>
        </td>
        <td>
          <button :disabled="!isRunning || !allowRequest" @click="togglePower(pod)">
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

  <button v-if="admin && isConnected" class="spaced" @click="showGlobalSettings = true">
    <fai name="tools" />Global settings
  </button>

  <modal v-if="selectedPod && selectedPod.window === 'settings'"
         @close="selectedPod = null" class="pod-modal">
    <h4>Branch {{ selectedPod.channel }}
      <span v-if="selectedPod.uid" class="pod-no">Pod {{ selectedPod.uid }}</span>
    </h4>
    <div class="buttons">
      <button v-if="selectedPod.enabled"
              @click="controlPod('disable'); selectedPod.enabled = false; selectedPod.settings = null">
        <fai name="regular/times-circle" />
        disable pod
       </button>
      <button v-else @click="controlPod('enable'); selectedPod.enabled = true">
        <fai name="regular/check-circle" />
        enable pod
      </button>
    </div>
    <div class="buttons">
      <button v-if="selectedPod.settings"
              :disabled="!allowRequest" @click="controlPod('squeeze')">
        squeeze nozzle
      </button>
    </div>
    <table v-if="selectedPod.settings">
      <tr v-for="setting in editableSettings" :key="setting.param">
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
    <div v-if="admin && selectedPod.settings">
      <button :class="{ stop: testRequesting === 'sensor' }"
            @click="togglePodRequest('sensor')">
        test bubble sensor
      </button>
      <span v-if="testRequests.sensor">
        <fai v-if="testRequests.sensor > currentBubbleThreshold" name="regular/circle" />
        <fai v-else name="circle" />
        {{ testRequests.sensor }}
      </span>
    </div>
    <div v-if="selectedPod.settings" class="end-buttons">
      <button class="warning" @click="revertSettings">
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
        <button class="test water" @click="controlPod('testWater')">test water pump</button>
      </div>
      <div class="buttons">
        <button class="test soap" @click="controlPod('testSoapOn')">start soap pump</button>
        <button class="test soap" @click="controlPod('testSoapOff')">stop soap pump</button>
      </div>
      <div v-if="selectedPod.on">
        <div class="buttons">
          <button @click="controlPod('blow')">blow air</button>
          <button @click="controlPod('squeeze')">squeeze</button>
        </div>
        <div class="test-request">
          <button :class="{ stop: testRequesting === 'waterLevel' }"
                  @click="togglePodRequest('waterLevel')">
            test water level
          </button>
          <span>{{ testRequests.waterLevel }}</span>
        </div>
        <div class="test-request">
          <button :class="{ stop: testRequesting === 'sensor' }"
                  @click="togglePodRequest('sensor')">
            test bubble sensor
          </button>
          <span v-if="testRequests.sensor">
            <fai v-if="testRequests.sensor > currentBubbleThreshold" name="regular/circle" />
            <fai v-else name="circle" />
            {{ testRequests.sensor }}
            ({{ currentBubbleThreshold }})
          </span>
        </div>
      </div>
      <div v-else class="no-table">
        <span>No Pod</span>
      </div>
    </div>
  </modal>

  <modal v-if="showGlobalSettings" class="pod-modal" @close="showGlobalSettings = false">
    <h4>Global</h4>
    <table>
      <tr v-for="(_, name) in globalSettings" :key="name">
        <td>{{ camelToTitle(name) }}</td>
        <td class="adjust">
          <input type="number" v-model="globalSettings[name]" @change="updateGlobal(name)"
                 max="255" min="0" />
        </td>
      </tr>
    </table>
    <p>For soap duty to be remembered, change it in Flo variables</p>
  </modal>

  <modal v-if="errorMessage" @close="errorMessage = null">
    <p class="error-message">{{ errorMessage }}</p>
  </modal>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Spinner from '@/components/util/Spinner.vue'
import Modal from '@/components/util/Modal.vue'
import { vocab, vocabMap } from '@/vocab'

export default {
  components: {
    Spinner,
    Modal
  },
  data() {
    return {
      isRunning: null,
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
      },
      showGlobalSettings: false,
      globalSettings: {
        fanSpeed: 100,
        soapDuty: 1.5
      },
      errorMessage: null,
      runningTimeSeconds: null,
      fault: undefined
    }
  },
  computed: {
    ...mapGetters('flo', ['allowRequest']),
    ...mapState('flo', ['runningSequences']),
    ...mapState(['admin']),
    runningHours() {
      if (this.runningTimeSeconds) {
        return Math.floor(this.runningTimeSeconds / 60 / 60)
      }
      return null
    },
    isConnected() {
      return this.isRunning !== null
    },
    editableSettings() {
      const output = {}
      Object.entries(this.selectedPod.settings).forEach(([k, v]) => {
        if (this.admin || v.param !== vocab.NO_BUBBLE_THRESHOLD) {
          output[k] = v
        }
      })
      return output
    },
    currentBubbleThreshold() {
      return this.selectedPod.settings[vocab.NO_BUBBLE_THRESHOLD].value
    }
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
        this.isRunning = state.isRunning
        this.runningTimeSeconds = state.runningTime
        this.fault = state.fault
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
    setRunning(v) {
      this.floRequest({
        command: 'controlFlo',
        args: {
          command: v
        }
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
      } else if (name === ' Servo offset') {
        name = 'Jaw alignment'
      } else if (name === 'Fan level') {
        name = 'Fan speed'
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
    },
    updateGlobal(name) {
      if (name === 'soapDuty') {
        this.globalSettings[name] = Math.max(0, Math.min(10, this.globalSettings[name]))
      } else if (name === 'fanSpeed') {
        this.globalSettings[name] = Math.max(0, Math.min(255, this.globalSettings[name]))
      }
      const value = this.globalSettings[name]
      this.floRequest({
        command: 'updateGlobal',
        args: {
          name,
          value
        }
      })
    }
  },
  created() {
    this.startStateInterval()
    this.startContactInterval()
    // this.getState()
    // this.interval = setInterval(() => this.getState(), 1000)
    window.onkeydown = (e) => {
      if (e && e.key === 'Escape') {
        this.showGlobalSettings = false
        this.selectedPod = null
      }
    }
  },
  beforeDestroy() {
    // clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  background: #eaeaea;
  align-items: center;
  padding: 10px;

  h1 {
    font-size: 1.2rem;
    margin: 0;
  }

  span.run-time {
    font-size: 1rem;
  }

  button.start-stop {
    font-size: 0.7rem;
    height: 2rem;
    background: #333;
    color: #eee;

    &.start {
      background: #fff;
      color: #555;
    }
  }
}

table {
  width: 100%;
  max-width: 700px;
  padding: 20px 10px;

  th, td {
    text-align: center;
  }

  th {
    font-size: 0.8rem;
  }
}

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

  button {
    &.water {
      background: #cbecff;

    }
    &.soap {
      background: #ffc;
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
    margin-top: 30px;
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
  &.disabled {
    border: 1px solid #ccc;
    background: #fff;
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

table.pod-table {
  thead {
    font-size: 1rem;
  }
}

button svg.fa-icon {
  height: 1rem;
}

.fa-icon {
  color: #555;
}

.spaced {
  margin: 15px;
}

.not-connected {
  margin-top: 20px;
}

h3.fault {
  font-size: 1.5rem;
  margin: 2rem;
}

p.error-message {
  margin-top: 25px;
}

</style>
