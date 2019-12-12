<template lang="html">
<base-element :name="name">
  <input v-for="arg in args" :key="arg.index" type="text"
         v-model="arg.value" @input="change">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'function',
  components: {
    BaseElement
  },
  props: {
    name: String,
    argCount: Number,
    data: Object
  },
  data() {
    return {
      args: []
    }
  },
  methods: {
    change() {
      const args = this.args.map(a => a.value).join(' ')
      this.$set(this.data.orig, '::', `${this.name} ${args}`)
    }
  },
  created() {
    const { args } = this.data
    if (args && args.length > 0) {
      this.args = args.map((value, index) => ({ value, index }))
    } else {
      this.args = Array(this.argCount).fill('')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
