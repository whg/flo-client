<template lang="html">
<div id="flo">
  <header>
    <h2><tt>fead</tt>Flo</h2>
    <span class="message">{{ message }}</span>
    <div class="controls">
      <button class="secondary" @click="update">update</button>
      <button class="primary" @click="save">save</button>
    </div>
  </header>

  <div class="columns">
    <nav>
      <b class="link" @click="current = 'variables'"
         :class="{ selected: mode === 'variables'}">
        Variables
      </b>
      <hr>
      <ul v-for="(seqs, instance) in sequences" :key="instance">
        <li>
          <div class="instance link">
            <b @click="current = { instance }" :class="{ selected: current.instance === instance && mode === 'instance-view' }">
              {{ instance }}
            </b>
            <ul>
              <li v-for="(seq, seqName) in seqs" :key="seqName"
                  class="link"
                  @click="current = { instance, sequence: seqName }">
                <span :class="{ selected:
                  current.instance === instance &&
                  current.sequence === seqName
                }">{{ seqName }}</span>
              </li>
              <li><a @click="addSequence(instance)">add</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <variables v-if="mode === 'variables'" ref="variables"/>
    <sequence v-else-if="mode === 'sequence-editor'" :instance="current.instance" :id="current.sequence"/>
    <instance-view v-else-if="mode === 'instance-view'" ref="instanceView" :instance-name-or-group="current.instance"/>

  </div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Sequence from '@/components/flo/Sequence.vue'
import InstanceView from '@/components/flo/InstanceView.vue'
import Variables from '@/components/flo/Variables.vue'

export default {
  components: {
    Sequence,
    InstanceView,
    Variables
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
      'message'
    ]),
    mode() {
      if (this.current === 'variables') {
        return 'variables'
      } else if (this.current.sequence) {
        return 'sequence-editor'
      } else if (this.current.instance) {
        return 'instance-view'
      }
      return null
    },
    instances() {
      return Object.keys(this.sequences)
    }
  },
  watch: {
    current(a, b) {
      if (a.instance !== b.instance) {
        this.getInstances()
      }
    }
  },
  methods: {
    ...mapActions('flo', {
      saveSequences: 'socketSaveSequences',
      updateSequence: 'socketUpdateSequences',
      getInstances: 'socketGetInstances'
    }),
    addSequence(instance) {
      const sequence = prompt('Sequence name:')
      if (sequence) {
        this.$set(this.sequences[instance], sequence, [])
        this.current = { instance, sequence }
      }
    },
    update() {
      const { instance, sequence } = this.current
      if (this.mode === 'sequence-editor') {
        this.updateSequence({
          sequence: this.sequences[instance][sequence],
          instance,
          sequenceName: sequence
        })
      } else if (this.mode === 'instance-view') {
        this.$refs.instanceView.update()
        console.log('updating insance')
      } else if (this.mode === 'variables') {
        this.$refs.variables.update()
      }
    },
    save() {
      if (this.mode === 'sequence-editor') {
        this.saveSequences(this.sequences)
      } else if (this.mode === 'variables') {
        this.$refs.variables.save()
      }
    }
  },
  created() {
    this.current.instance = Object.keys(this.sequences)[0]
  }
}
</script>

<style lang="scss" scoped>
#flo {
  max-width: 820px;
  margin: 0 auto;
  text-align: left;
}

header {
  h2, h3, h4, h5 {
    display: inline-block;
  }
  h2 {
    margin-right: 123px;
  }
  h4, h5 {
    margin-right: 10px;
    color: #444;
  }
  .message {
    color: #888;
  }
}

.columns {
  margin: 0;
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
      span {
        padding: 3px 6px;
      }
    }
  }
  li {
    list-style: none;
    margin: 0;
    b {
      white-space: nowrap;
    }
  }
}
.sequence {
  // display: inline-block;
  // width: 200px;
}
.controls {
  display: inline-block;
  float: right;
  padding-top: 12px;
  button {
    display: inline-block;
    margin: 0px 5px 5px 0px;
    background: #444;
    color: #fff;
    border: none;
  }
}

.selected {
  color: #0b9;
}
</style>
