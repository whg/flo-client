<template lang="html">
<base-element :name="$options.name">
  <input type="text" v-model.number="value" @input="change">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'delay',
  components: {
    BaseElement
  },
  props: {
    data: Object
  },
  data() {
    return {
      value: null
    }
  },
  methods: {
    change() {
      this.$set(this.data.orig, '::', `delay ${this.value}`)
    }
  },
  created() {
    this.value = this.data.args[0]
  }
}
</script>

<style lang="scss" scoped>
</style>
