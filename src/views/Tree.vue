<template lang="html">
<div class="">
  {{ state.numPods }}
  <table>
    <thead>
      <th>Channel</th>
      <th>UID</th>
      <th>Status</th>
      <th>Bubbles</th>
      <th>Squeezes</th>
    </thead>
  </table>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('flo', ['state'])
  },
  methods: {
    ...mapActions('flo', {
      getState: 'socketState'
    })
  },
  mounted() {
    this.getState()
  }
}
</script>

<style lang="scss" scoped>
</style>
