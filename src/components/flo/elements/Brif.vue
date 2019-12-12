<template lang="html">
<base-element :name="$options.name">
  <select v-model="operator">
    <option v-for="option in operatorChoices" :key="option"
            :value="option">
      {{ option }}
    </option>
  </select>
  <input type="text" v-model="test" @input="change">
  <input type="text" v-model="destination" @input="change">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'brif',
  components: {
    BaseElement
  },
  props: {
    data: Object
  },
  data() {
    return {
      operator: '==',
      operatorChoices: ['==', '!=', '<', '>', '<=', '>='],
      test: null,
      destination: null
    }
  },
  methods: {
    change() {
      const f = `brif ${this.operator} ${this.test} ${this.destination}`
      this.$set(this.data.orig, '::', f)
    }
  },
  created() {
    [this.operator, this.test, this.destination] = this.data.args
  }
}
</script>

<style lang="scss" scoped>
</style>
