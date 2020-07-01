<template>
  <div class="tab-wrapper">
    <div class="filter-container" v-if="'kb' == activeName">
      <el-input style="width: 150px;" size="small" placeholder="请输任务名称" v-model="input3">
      </el-input>
      <el-select style="width: 150px;" v-model="value" size="small" filterable clearable placeholder="请选择负责人">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model="value2" size="small" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-select style="width: 150px;" v-model="value" size="small" clearable placeholder="请选择任务状态">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-tabs v-model="activeName" style="margin:6px 10px 0px 10px;width:100%;height:100%;overflow:hidden" type="border-card">
      <el-tab-pane label="看板" name="kb">
        <board v-if="'kb' == activeName" />
      </el-tab-pane>
      <el-tab-pane label="进展" name="jz">
        <chart v-if="'jz' == activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import Board from './board'
import Chart from './chart'
export default {
  name: 'DragKanbanDemo',
  components: {
    Board,
    Chart
  },
  data() {
    return {
      activeName: 'kb',
      value2: [],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
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
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    console.log('projectID', this.$route.name.substring(1))
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss">
.tab-wrapper {
  height: 100%;
  position: relative;
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
    height: 100%;
    overflow: hidden;
    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }
  > .filter-container {
    z-index: 999;
    position: absolute;
    top: 4px;
    left: 180px;
  }
}
</style>

