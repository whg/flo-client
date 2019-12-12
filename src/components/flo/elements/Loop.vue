<template lang="html">
<base-element :name="$options.name">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'loop',
  components: {
    BaseElement
  },
  props: {
    data: Object
  }
}
</script>

<style lang="scss" scoped>
</style>
