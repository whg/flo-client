<template lang="html">
<div id="sequence-container">
  <header>
    <span>Schedule</span>
    <input v-model="schedule" type="text" placeholder="auto"
           @input="scheduleChange">
  </header>
  <div class="sequence">
    <div class="sidebar">
      <div class="element-panel">
        <draggable :group="{ name: 'g', pull: 'clone', put: false }" :sort="false">
          <button v-for="builtin in builtinFunctions" :key="builtin"
                  :name="builtin" @click="insertElement(builtin)">
            {{ builtin }}
          </button>
          <button v-for="custom in Object.keys(customFunctions)" :key="custom"
                  class="custom" :name="custom"
                  @click="insertElement(custom)">
            {{ custom }}
          </button>
        </draggable>
      </div>
    </div>
    <div class="sequence-editor">
      <draggable v-if="elements.length > 0"
                 v-model="elements" :group="'g'"
                 class="elements" handle=".handle"
                 @start="drag = true"
                 @add="insert">
        <wrapper  v-for="(elem, index) in elementList" :key="elem.id"
                  :element="elem"
                  :class="runPoint === index ? 'active' : null"
                  @delete="removeElement(index)">
          <custom-function v-if="elem.custom" :name="elem.func"
                           :data="elem"
                           :arg-count="customFunctions[elem.func].argCount" />
          <component v-else :is="elem.func" :data="elem" />
        </wrapper>
      </draggable>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Draggable from 'vuedraggable'
import Wrapper from './elements/Wrapper.vue'
import Action from './Action.vue'
import Delay from './elements/Delay.vue'
import FeadSet from './elements/FeadSet.vue'
import Loop from './elements/Loop.vue'
import Log from './elements/Log.vue'
import Nop from './elements/Nop.vue'
import Brif from './elements/Brif.vue'
import CustomFunction from './elements/CustomFunction.vue'

export default {
  components: {
    Draggable,
    Wrapper,
    Action,
    Delay,
    set: FeadSet,
    Loop,
    Log,
    Nop,
    Brif,
    CustomFunction
  },
  props: {
    instance: String,
    id: String
  },
  data() {
    return {
      elements: [],
      schedule: null,
      drag: false
    }
  },
  computed: {
    ...mapState('flo', {
      sequences: (state) => state.sequences,
      runPoint(state) {
        return state.runPoints[`${this.instance}-${this.id}`]
      },
      customFunctions(state) {
        try {
          let instance = state.instances[this.instance]
          if (this.instance in state.groups) {
            instance = state.instances[state.groups[this.instance][0]]
          }
          return instance.functions
        } catch (e) {
          return []
        }
      }
    }),
    sequence() {
      return this.sequences[this.instance][this.id]
    },
    elementList() {
      return this.elements.map(e => {
        const [func, ...args] = e['::'].split(/\s+/)
        return {
          func,
          args,
          orig: e,
          custom: this.isCustom(func),
          id: e._id
        }
      })
    }
  },
  watch: {
    instance() { this.update() },
    id() { this.update() }
  },
  methods: {
    isCustom(func) {
      return !this.builtinFunctions.includes(func)
    },
    update() {
      try {
        if (Array.isArray(this.sequence)) {
          this.elements = this.sequence
        } else if ('program' in this.sequence) {
          this.elements = this.sequence.program
        }
        this.schedule = this.sequence.schedule || null
        this.elements.forEach((e, i) => {
          this.elements[i]._id = this.randomID()
        })
      } catch (e) {}
    },
    insertElement(name, index) {
      const element = {
        '::': name
      }
      if (index === undefined) {
        this.elements.push(element)
      } else {
        this.elements.splice(index, 0, element)
      }
      console.log('elements', this.elements)
    },
    insert({ newIndex, item }) {
      this.insertElement(item.name, newIndex)
      item.remove()
    },
    removeElement(index) {
      this.elements.splice(index, 1)
    },
    insertCustomElement({ index }) {
      const name = prompt('Function name:')
      this.insertElement(name, index)
    },
    reflow() {

    },
    scheduleChange({ target }) {
      let { value } = target

      if (Array.isArray(this.sequence)) {
        const program = [...this.sequence]
        this.$store.state.flo.sequences[this.instance][this.id] = {
          program,
          schedule: value
        }
      } else {
        if (value) {
          this.sequence.schedule = value
        } else {
          delete this.sequence.schedule
        }
      }
    }
  },
  created() {
    this.update()
  }
}
</script>

<style lang="scss" scoped>
#sequence-container {
  width: 100%;
  margin: 0px 10px;

  header {
    margin-bottom: 5px;
    text-align: right;
    input[type="text"] {
      width: 120px;
      margin-left: 10px;
    }
  }
}

.sequence {
  display: flex;
  width: 100%;
  .sidebar {
    margin-right: 10px;
    .element-panel button {
      display: block;
      padding: 0;
      width: 120px;
      margin-bottom: 5px;
      font-family: Courier;
      text-transform: none;
      font-weight: bold;

      &.custom {
        background: #888;
        color: #fff;
      }
    }
  }

  .sequence-editor {
    flex-grow: 1;
    background: #eee;
  }
}
.trash {
  background: red;
  height: 20px;
  div {
    height: 100% !important;
    display: none;
  }
}
</style>
