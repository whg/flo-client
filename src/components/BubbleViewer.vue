<template lang="html">
  <div class="small">
    {{ addresses }}
    <line-chart v-if="chartData" ref="chart" :chart-data="chartData"></line-chart>
    <button @click="test()">Randomize</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LineChart from '@/charts/Line.js'
import { vocab } from '@/vocab'

export default {
  components: {
    LineChart
  },
  props: {
    addresses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartData: null,
      interval: null,
      intervalDelay: 200,
      values: {},
      colours: [
        '#ff9999',
        '#99ff99',
        '#9999ff'
      ]
    }
  },
  computed: {
    ...mapState('flo', ['socket'])
  },
  watch: {
    addresses(newValue, oldValue) {
      newValue.forEach((address) => {
        if (!oldValue.includes(address)) {
          this.values[address] = []
        }
      })
      // oldValue.forEach((address) => {
      //   if (!newValue.includes(address)) {
      //     delete this.values[address]
      //   }
      // })
      if (oldValue.length === 0) {
        this.interval = setInterval(this.requestData, this.intervalDelay)
      } else if (newValue.length === 0) {
        clearInterval(this.interval)
      }
    }
  },
  methods: {
    ...mapActions('flo', ['feadRequest']),
    async requestData() {
      this.addresses.forEach(async(address, i) => {
        const request = {
          method: 'get',
          address,
          param: vocab.BUBBLE_DISTANCE
        }
        const value = await this.feadRequest(request)

        this.values[request.address].push({
          t: new Date(),
          y: value
        })

        if (i === Object.keys(this.values).length - 1) {
          this.generateData()
        }
      })
    },
    generateData() {
      this.chartData = {
        datasets: Object.entries(this.values).map(([k, v], i) => ({
          label: k,
          data: v,
          fill: false,
          pointRadius: 0,
          borderColor: this.colours[i]
        }))
      }
    },
    async test() {

    }
  },
  mounted() {
    this.addresses.forEach((address) => {
      this.values[address] = []
    })
    if (this.addresses.length > 0) {
      this.interval = setInterval(this.requestData, this.intervalDelay)
    }

    // this.generateData()
    // setInterval(() => {
    //
    // }, 100)
  }
}
</script>

<style lang="scss" scoped>
</style>
