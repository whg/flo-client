<template lang="html">
<div class="">
  <h2>Pods</h2>
  {{ pods }}
  {{ JSON.stringify(runningSequences) }}
  <table>
    <thead>
      <th>Channel</th>
      <th>UID</th>
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
        <td @click="togglePower(pod)">Power {{ pod.on ? 'off' : 'on' }}</td>
        <td @click="selectedPod = pod">edit</td>
      </tr>
    </tbody>
  </table>

  <div v-if="selectedPod" class="">
    <h3>{{ selectedPod }}</h3>
    <span @click="powerPod(selectedPod, true)">Power on</span>
    <span @click="powerPod(selectedPod, false)">Power off</span>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Spinner from '@/components/util/Spinner.vue'

export default {
  components: {
    Spinner
  },
  data() {
    return {
      pods: {},
      interval: null,
      selectedPod: null
    }
  },
  computed: {
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
    startInterval() {
      clearTimeout(this.interval)
      this.floRequest('state').then((state) => {
        this.pods = state.pods
        this.interval = setTimeout(() => {
          this.startInterval()
        }, 1000)
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
    }
  },
  created() {
    this.startInterval()
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
</style>
