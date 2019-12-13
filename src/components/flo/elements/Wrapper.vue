<template>
<div class="wrapper" element="true">
  <div class="inner handle" :class="{ custom: element.custom }"
       @mouseup="selectedElement = element"
       @keydown.ctrl.backspace="$emit('remove')">
    <slot></slot>
    <div class="meta">
      <input v-if="selected" type="text" placeholder="label"
             v-model="element.orig.label" />
      <span v-else class="label">
        {{ element.orig.label }}
      </span>
      <span v-if="selected" class="delete link" @click="$emit('delete')">✕</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    element: Object
  },
  data() {
    return {
      focused: false
    }
  },
  computed: {
    selectedElement: {
      get() { return this.$store.state.selectedElement },
      set(e) { this.$store.state.selectedElement = e }
    },
    selected() {
      return this.selectedElement === this.element
    }
  }
}
</script>

<style lang="scss" scoped>
$handle-width: 20px;

.wrapper {
  margin-bottom: 0px;
  border-radius: 3px;
  background: none;

  .inner {
    display: inline-block;
    position: relative;
    // background: #ddd;
    color: #555;
    padding: 5px 3px 5px 10px;
    border-radius: 5px;
    font-family: Courier, monospace;

    &.custom {
      // background: #dee;
      color: #333;
    }

    .meta {
      display: inline-block;
      span.label {
        padding-right: 10px;
        color: #555;
      }
      input {
        padding-right: 10px;
      }
      .delete {
        padding: 0px 5px;
      }
    }
  }
}

.handle:hover {
  cursor: grab;
}
</style>
