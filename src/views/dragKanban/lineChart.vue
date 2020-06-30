<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.initChart(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      //加工数据
      let xAxisData = []
      let waitData = []
      let startData = []
      let pauseData = []
      let finishData = []
      if (this.chartData.length > 0) {
        this.chartData.forEach(item => {
          xAxisData.push(item['日期'])
          waitData.push(item['未开始'])
          startData.push(item['进行中'])
          pauseData.push(item['暂停中'])
          finishData.push(item['已完成'])
        })
      }
      this.setOptions({ xAxisData, waitData, startData, pauseData, finishData })
      this.chart.resize()
    },
    setOptions({ xAxisData, waitData, startData, pauseData, finishData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['未开始', '进行中', '暂停中', '已完成']
        },
        series: [
          {
            name: '未开始',
            itemStyle: {
              normal: {
                color: '#fc6b04',
                lineStyle: {
                  color: '#fc6b04',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: waitData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '进行中',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#36a3f7',
                lineStyle: {
                  color: '#36a3f7',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: startData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '暂停中',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#f4516c',
                lineStyle: {
                  color: '#f4516c',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: pauseData
          },
          {
            name: '已完成',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#34bfa3',
                lineStyle: {
                  color: '#34bfa3',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: finishData
          }
        ]
      })
    }
  }
}
</script>
