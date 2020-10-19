<template lang="html">
<div class="">
  <div v-if="availableBranches" class="branch-select">
    <button class="small" @click="selectedBranches = [...availableBranches]">All</button>
    <button class="small" @click="selectedBranches = []">None</button>
    <ul>
      <li v-for="branch in availableBranches" :key="branch">
        <input type="checkbox" :id="branch" :value="branch" v-model="selectedBranches" />
        <label :for="branch">{{ branch }}</label>
      </li>
    </ul>
  </div>
  <div>
    <h4>Water</h4>
    <button v-if="'water' in flushing" @click="flush('water', false)">stop</button>
    <button v-else @click="flush('water', true)">flush</button>
  </div>
  <br />
  <div>
    <h4>Soap</h4>
    <button v-if="'soap' in flushing" @click="flush('soap', false)">stop</button>
    <button v-else @click="flush('soap', true)">flush</button>
  </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
/* import Spinner from '@/components/util/Spinner.vue' */
/* import Modal from '@/components/util/Modal.vue' */
/* import { vocabMap } from '@/vocab' */

export default {
  components: {
    /* Spinner, */
    /* Modal */
  },
  data() {
    return {
      availableBranches: [],
      selectedBranches: [],
      flushing: {}
    }
  },
  computed: {
    ...mapGetters('flo', ['allowRequest']),
    ...mapState('flo', ['runningSequences'])
  },
  watch: {
    selectedPod() {
      if (this.testRequesting) {
        this.togglePodRequest(this.testRequesting)
      }
    }
  },
  methods: {
    ...mapActions('flo', ['floRequest']),
    flush(target, on = true) {
      this.floRequest({
        command: 'flush',
        args: {
          on,
          target,
          channels: this.selectedBranches
        }
      })
      console.log(on)
      if (on) {
        this.$set(this.flushing, target, true)
      } else {
        this.$delete(this.flushing, target)
      }
    }
  },
  created() {
    this.floRequest('state').then((state) => {
      this.availableBranches = Object.values(state.pods).map(p => p.channel)
    })
  }
}
</script>

<style lang="scss" scoped>

ul {
  li {
    display: inline-block;
    margin-right: 1em;
  }
  label {
    display: inline-block;
  }
}

label {
  margin-left: 0.3em;
}
</style>
