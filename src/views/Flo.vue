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
    <div class="sequence">
      <sequence :instance="current.instance" :id="current.sequence"/>
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
      updateSequences: 'socketSequences'
    }),
    update() {
      // console.log(this.$store)
      // this.updateSequences({
      //   a: {
      //     b: [1, 2, 3],
      //     c: 34
      //   }
      // })
    },
    addSequence(instance) {
      const sequence = prompt('Sequence name:')
      this.$set(this.sequences[instance], sequence, [])
      this.current = { instance, sequence }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
