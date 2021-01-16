<template lang="html">
<div class="variables">
  <div v-for="(variable, index) in list" :key="index" class="variables-list">
    <input v-model="variable.key" type="text" ref="key" @blur="removeEmpty">
    <input v-model.number="variable.value" type="text">
  </div>
  <p><b class="link" @click="add">add</b></p>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapState('flo', ['variables'])
  },
  methods: {
    ...mapActions('flo', {
      saveVariables: 'socketSaveVariables',
      updateVariables: 'socketUpdateVariables'
    }),
    add() {
      this.list.push({ key: '', value: 0 })
      this.$nextTick(() => {
        this.$refs.key[this.$refs.key.length - 1].focus()
      })
    },
    removeEmpty() {
      this.list = this.list.filter(e => e.key !== '')
    },
    create() {
      this.$store.state.flo.variables = Object.fromEntries(
        this.list.map(e => [e.key, e.value])
      )
      return this.variables
    },
    update() {
      this.updateVariables(this.create())
    },
    save() {
      this.saveVariables(this.create())
    }
  },
  created() {
    this.list = Object.entries(this.variables).map(([key, value]) => ({ key, value }))
  }
}
</script>

<style lang="scss" scoped>
.variables-list {
  input:first-child[type="text"] {
    width: 150px !important;
  }
}
</style>
