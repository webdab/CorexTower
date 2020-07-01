<template>
  <div class="chart-wrapper">
    <div class="filter-container">
      <!-- 搜索条 -->
      <el-date-picker v-model="time" :clearable="false" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <div>
      <panel-group :total-tack-status="totalTackStatus" />
    </div>
    <div class="chart-content">
      <line-chart :chart-data="lineChartData" height="400px" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import waves from '@/directive/waves'
import PanelGroup from './PanelGroup'
import lineChart from './lineChart'
import { getTackStatus, getProjectDetails } from '@/api/project'
export default {
  components: { PanelGroup, lineChart },
  directives: { waves },
  data() {
    return {
      projectId: '',
      time: [],
      totalTackStatus: {
        wait: 0,
        start: 0,
        pause: 0,
        finish: 0
      },
      lineChartData: [],
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
  mounted() {
    this.getProjectDetails()
  },
  methods: {
    //获取任务详情
    getProjectDetails() {
      let today = moment().format('YYYY-MM-DD');
      console.log(today)
      getProjectDetails(this.projectId).then(res => {
        this.time = [res.data.startDate, today]
        this.handleFilter()
      })
    },
    //获取任务状态集
    getTackStatus() {
      getTackStatus({
        projectId: this.projectId,
        startDate: this.time[0] || '',
        endDate: this.time[1] || ''
      }).then(res => {
        this.totalTackStatus = {
          wait: res.data.totalMap[0]['未开始'] || 0,
          start: res.data.totalMap[0]['进行中'] || 0,
          pause: res.data.totalMap[0]['暂停中'] || 0,
          finish: res.data.totalMap[0]['已完成'] || 0
        }
        this.lineChartData = res.data.dataMap
      })
    },
    // 搜索
    handleFilter() {
      this.getTackStatus()
    }
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
