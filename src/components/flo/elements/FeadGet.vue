<template lang="html">
<base-element :name="$options.name">
  <input type="text" v-model="param" @input="change">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'get',
  components: {
    BaseElement
  },
  props: {
    data: Object
  },
  data() {
    return {
      param: null
    }
  },
  methods: {
    change() {
      this.$set(this.data.orig, '::', `get ${this.param}`)
    }
  },
  created() {
    [this.param] = this.data.args
  }
}
</script>

<style lang="scss" scoped>
</style>
