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
@import "styles/skeleton";
@import "styles/main";
</style>

<style lang="scss">
body {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 400;
  font-family: Arial, sans-serif;
  color: #222;
}

#app {
  text-align: center;

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
