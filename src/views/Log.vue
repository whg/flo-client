<template lang="html">
<div class="log">
  <h2><tt>fead</tt>Log</h2>
  <p v-for="line in log" :key="line">{{ line }}</p>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('flo', ['log'])
  }
}
</script>

<style lang="scss" scoped>
div.log {
  max-width: 640px;
  margin: 0 auto;
  font-family: Courier, monospace;
  font-size: 12px;
  text-align: left;
  padding: 15px;
  p {
    margin: 0;
  }
}
</style>
