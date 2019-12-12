<template lang="html">
<base-element :name="$options.name">
  <input type="text" v-model="param" @input="change">
  <input type="text" v-model="value" @input="change">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'set',
  components: {
    BaseElement
  },
  props: {
    data: Object
  },
  data() {
    return {
      param: null,
      value: null
    }
  },
  methods: {
    change() {
      this.$set(this.data.orig, '::', `set ${this.param} ${this.value}`)
    }
  },
  created() {
    [this.param, this.value] = this.data.args
  }
}
</script>

<style lang="scss" scoped>
</style>
