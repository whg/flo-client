<template>
  <div id="auth">
    <div class="numpad">
      <template v-for="i in 9">
        <button :key="i" :class="{ touch: i in active }" @click="press">{{ i }}</button>
        <br :key="`${i}-br`" v-if="i % 3 === 0 && i !== 0" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nextPage: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      active: {},
      history: []
    }
  },
  methods: {
    press(keyOrEvent) {
      const k = keyOrEvent.target ? keyOrEvent.target.textContent : keyOrEvent
      this.$set(this.active, k, true)
      setTimeout(() => {
        this.$delete(this.active, k)
      }, 150)
      this.process(k)
    },
    process(k) {
      this.history.push(k)
      while (this.history.length > 4) {
        this.history.shift()
      }
      const input = this.history.join('')
      if (input === '6985' || input === '][][') {
        console.log('next')
        const nextPage = this.nextPage || 'dashboard'
        this.$store.commit('authenticate')
        this.$router.push({ name: nextPage })
      }
    }
  },
  mounted() {
    window.onkeydown = (e) => {
      this.press(e.key)
    }
  }
}
</script>

<style lang="scss" scoped>
#auth {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;

  .numpad input[type="password"] {
    display: block;
    margin: 0 auto;
    font-size: 2rem;
    width: 6rem;
    text-align: center;
    margin-bottom: 1rem;
  }
}

div.numpad {
  text-align: center;

  button {
    font-size: 3rem;
    width: 4rem;
    height: 4rem;
    padding: 10px;
    line-height: 0;
    background: #555;
    color: #fff;
    margin: 0.5rem;
    border: none;

    &.touch {
      background: #aaa;
    }
  }
}
</style>
