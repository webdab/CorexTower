<template>
  <div class="chart-wrapper">
    <div class="filter-container">
      <!-- 搜索条 -->
      <el-date-picker v-model="pTime" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <div>
      <panel-group :tack-status="tackStatus" />
    </div>
    <div class="chart-content">
      <line-chart :chart-data="lineChartData" height="400px" />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import PanelGroup from './PanelGroup'
import lineChart from './lineChart'
export default {
  components: { PanelGroup, lineChart },
  directives: { waves },
  data() {
    return {
      projectId: '',
      pTime: [],
      tackStatus: {
        wait: 11,
        start: 20,
        pause: 33,
        finish: 5
      },
      lineChartData: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.projectId = this.$route.name.substring(1)
  },
  methods: {
    //获取任务状态集
    getTackStatusList() {},
    // 搜索
    handleFilter() {}
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  height: calc(100vh - 94px);
  box-sizing: border-box;
  padding: 15px;
  position: relative;
  background-color: #fdfdfd;
  overflow: hidden;
  overflow-y: auto;

  .filter-container {
    .el-button {
      margin-top: 8px;
      margin-left: 10px;
    }
  }
  .chart-content {
    padding: 50px;
    background-color: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
