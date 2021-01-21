<template>
  <div id="app" @click="clicked">
    <div v-if="admin" class="admin-header">
      <span>Admin mode</span>
      <div>
        <router-link to="admin">Dashboard</router-link>
        <router-link to="log">Log</router-link>
        <router-link to="flo">Flo</router-link>
        <router-link to="console">Console</router-link>
      </div>
    </div>
    <router-view/>
    <footer>
      {{ appVersion }} {{ versions }}
    </footer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import '@/styles/skeleton.css'
import '@/styles/main.scss'

export default {
  name: 'app',
  data() {
    return {
      appVersion: undefined,
      versions: undefined
    }
  },
  computed: {
    ...mapState(['admin'])
  },
  methods: {
    ...mapActions('flo', ['floRequest']),
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
  },
  mounted() {
    this.floRequest('versions').then((versions) => {
      this.versions = versions
    })
    console.log(process.env)
    this.appVersion = `client: ${process.env.VUE_APP_VERSION}, `
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

div.admin-header {
  background: #555;
  display: flex;
  justify-content: space-between;
  padding: 1px 10px;
  color: #fff;
  font-size: 0.8rem;

  span {
    color: #fff;
  }

  a {
    color: #fff;
    margin-left: 1rem;
    text-decoration: none;
  }
}

footer {
  margin-top: 2rem;
  font-family: monospace;
  font-size: 0.75rem;
  color: #999;
}
</style>
