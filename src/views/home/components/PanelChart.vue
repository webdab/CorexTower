<template>
  <div />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  props: {},
  data() {
    return {
      chart: null
    }
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      // this.setOptions(this.chartData)
    },
    setOptions() {}
  }
}
</script>
