<template lang="html">
<div class="element" :class="name">
  <b>{{ name }}</b>
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'base-element',
  props: {
    name: String
  }
}
</script>

<style lang="scss" scoped>
div.element {
  display: inline-block;
  b {
    margin-right: 10px;
  }
}
</style>
