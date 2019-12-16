<template lang="html">
<div class="instance-view">
  <!-- <h3 v-if="isGroup">Instance Group</h3>
  <h3 v-else>Instance {{ instanceList.length > 1 ? 'Array' : '' }}</h3> -->
  <table>
    <thead>
      <th v-if="isInstanceArray">{{ arrayIndex }}</th>
      <th>enabled</th>
      <th>address</th>
    </thead>
    <tr v-for="options in instanceList" :key="options.id">
      <td v-if="isInstanceArray"> {{ options[arrayIndex] }}</td>
      <td>
        <input v-model="options.enabled" type="checkbox">
      </td>
      <td>
        <input v-model.number="options.address" type="text">
      </td>
    </tr>
  </table>
  <!-- {{ instanceList }} -->
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    instanceNameOrGroup: String
  },
  computed: {
    ...mapState('flo', [
      'instances',
      'groups'
    ]),
    isGroup() {
      return this.instanceNameOrGroup in this.groups
    },
    isInstanceArray() {
      return !this.isGroup && this.instanceList.length > 1
    },
    instanceList() {
      if (this.isGroup) {
        const instanceNames = this.groups[this.instanceNameOrGroup]
        return this.addIDs(instanceNames.map(n => this.instances[n].component))
      } else {
        const instance = this.instances[this.instanceNameOrGroup]
        if ('instances' in instance) {
          return this.addIDs(instance.instances.map(i => i.component))// InstanceArray
        } else {
          return this.addIDs([instance.component]) // Instance
        }
      }
    },
    arrayIndex() {
      return this.instances[this.instanceNameOrGroup].index
    }
  },
  methods: {
    ...mapActions('flo', {
      updateInstance: 'socketUpdateInstance'
    }),
    addIDs(l) {
      return l.map(e => ({ ...e, id: this.randomID() }))
    },
    update() {
      if (this.instanceList.length === 1) {
        this.updateInstance({
          name: this.instanceNameOrGroup,
          options: this.instanceList[0]
        })
      } else if (this.isGroup) {
        this.groups[this.instance].forEach((name, i) => {
          this.updateInstance({ name, options: this.instanceList[i] })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.instance-view {
  margin-left: 60px;
  h3 {
    font-size: 18px;
  }
  td {
    text-align: center;
  }
}
</style>
