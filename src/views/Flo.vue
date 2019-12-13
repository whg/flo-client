<template lang="html">
<div id="flo">
  <div class="sequence-editor">
    <nav>
      <ul v-for="(seqs, instance) in sequences" :key="instance">
        <li>
          <div class="instance">
            <b>{{ instance }}</b>
            <ul>
              <li v-for="(seq, seqName) in seqs" :key="seqName"
                  class="link"
                  @click="current = { instance, sequence: seqName }">
                {{ seqName }}
              </li>
              <li><a @click="addSequence(instance)">add</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <sequence :instance="current.instance" :id="current.sequence"/>
    <div class="controls">
      <button class="secondary" @click="update">update</button>
      <button class="primary" @click="save(sequences)">save</button>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// import Draggable from 'vuedraggable'
// import Action from '@/components/flo/Action.vue'
import Sequence from '@/components/flo/Sequence.vue'

export default {
  components: {
    // Draggable
    // Action
    Sequence
  },
  data() {
    return {
      current: {
        instance: null,
        sequence: null
      }
    }
  },
  computed: {
    ...mapState('flo', [
      'sequences',
      'groups'
    ]),
    instances() {
      return Object.keys(this.sequences)
    }
  },
  methods: {
    ...mapActions('flo', {
      save: 'socketSaveSequences',
      updateSequence: 'socketUpdateSequences'
    }),
    addSequence(instance) {
      const sequence = prompt('Sequence name:')
      this.$set(this.sequences[instance], sequence, [])
      this.current = { instance, sequence }
    },
    update() {
      const { instance, sequence } = this.current
      this.updateSequence({
        sequence: this.sequences[instance][sequence],
        instance,
        sequenceName: sequence
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#flo {
  max-width: 820px;
  margin: 0 auto;
}
.sequence-editor {
  display: flex;
}
nav {
  padding: 0px 5px;
  padding-right: 20px;

  ul {
    margin: 0;
    margin-bottom: 10px;
    ul {
      margin-left: 1rem;
    }
    li {
      list-style: korean;
    }
  }
  li {
    list-style: none;
    margin: 0;
  }
}
.sequence {
  // display: inline-block;
  // width: 200px;
}
.controls {
  button {
    display: block;
    float: right;
    margin: 0px 5px 5px 0px;
  }
}
</style>
