<template lang="html">
<base-element :name="$options.name">
  <input type="text" v-model="value" @input="change">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'log',
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
      this.$set(this.data.orig, '::', `log ${this.value}`)
    }
  },
  created() {
    this.value = this.data.args.join(' ')
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 200px;
}
</style>
