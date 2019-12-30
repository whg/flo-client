<template>
<div id="app" @click="clicked">
  <!-- <div id="nav"> -->
    <!-- <router-link to="/">Home</router-link> | -->
  <!-- </div> -->
  <router-view/>
</div>
</template>

<script>

import '@/styles/skeleton.css'
import '@/styles/main.scss'

export default {
  name: 'app',
  methods: {
    clicked(e) {
      let target = e.target
      for (var i = 0; i < 5; i++) {
        if (!target) {
          break
        } else if (target.classList.contains('handle')) {
          return
        }
        target = target.parentElement
      }
      this.$store.state.selectedElement = null
    }
  }
}
</script>

<style lang="scss">
#app {
  input[type="text"] {
    width: 90px;
    padding: 0px;
    font-family: monospace;
    background: unset;
    border: none;
    border-bottom: 1px dashed #aaa;
    border-radius: 0;
    margin-right: 10px;

    &:focus {
      border: none;
      border-bottom: 1px solid #666;
    }
  }
}
</style>
