<template lang="html">
<base-element :name="$options.name">
  <input type="text" v-model="instance" @input="change">
  <input type="text" v-model="sequence" @input="change">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'run',
  components: {
    BaseElement
  },
  props: {
    data: Object
  },
  data() {
    return {
      instance: null,
      sequence: null
    }
  },
  methods: {
    change() {
      this.$set(this.data.orig, '::', `run ${this.instance} ${this.sequence}`)
    }
  },
  created() {
    [this.instance, this.sequence] = this.data.args
  }
}
</script>

<style lang="scss" scoped>
</style>
