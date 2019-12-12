<template lang="html">
<base-element :name="$options.name">
</base-element>
</template>

<script>
import BaseElement from './BaseElement.vue'

export default {
  name: 'nop',
  components: {
    BaseElement
  }
}
</script>
