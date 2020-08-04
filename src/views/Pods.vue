<template lang="html">
<div class="">
  {{ pods }}

  <table>
    <thead>
      <th>Channel</th>
      <th>UID</th>
      <th>State</th>
      <th>Squeezes / hour</th>
      <th>Bubbles / hour</th>
      <th></th>
    </thead>
    <tbody>
      <tr v-for="pod in pods" :key="pod.channel">
        <td>{{ pod.channel }}</td>
        <td>{{ pod.uid }}</td>
        <td>{{ pod.on ? 'on' : 'off' }}</td>
        <td></td>
        <td></td>
        <td @click="selectedPod = pod">edit</td>
      </tr>
    </tbody>
  </table>

  <div v-if="selectedPod" class="">
    <h3>{{ selectedPod }}</h3>
    <span @click="power(selectedPod, true)">Power on</span>
    <span @click="power(selectedPod, false)">Power off</span>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      interval: null,
      selectedPod: null
    }
  },
  computed: {
    ...mapState('flo', ['state']),
    ...mapState('flo', {
      pods: (store) => {
        const { pods } = store.state
        if (pods) {
          return Object.values(store.state.pods).sort((a, b) => a.channel - b.channel)
        }
        return []
      }
    })
  },
  methods: {
    ...mapActions('flo', {
      getState: 'socketState',
      sendControl: 'socketControl',
      run: 'socketRun'
    }),
    power(pod, value) {
      this.sendControl({
        command: 'enablePod',
        args: { channel: pod.channel, value }
      })
      if (value) {
        setTimeout(() => {
          this.run({
            name: 'Pods.setup',
            arg: { count: pod.index, follow: false }
          })
          console.log(pod)
        }, 1000)
      }
    }
  },
  created() {
    this.getState()
    this.interval = setInterval(() => this.getState(), 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
</style>
