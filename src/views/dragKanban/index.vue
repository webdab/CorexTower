<template>
  <div class="tab-wrapper">
    <div v-if="'kb' == activeName" class="filter-container">
      <el-input v-model="taskQuery.taskName" style="width: 150px;" size="small" placeholder="请输任务名称" @keyup.enter.native="handleFilter" />
      <el-select v-model="taskQuery.principalId" style="width: 150px;" size="small" filterable clearable placeholder="请选择负责人" @change="handleFilter">
        <el-option v-for="item in allUserList" :key="item.userId" :label="item.userName" :value="item.userId" />
      </el-select>
      <el-date-picker
        v-model="taskQuery.taskTime"
        style="width: 280px;"
        value-format="yyyy-MM-dd"
        size="small"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
:picker-options="pickerOptions"
        @change="handleFilter"
      />
      <el-select v-model="taskQuery.taskStatus" style="width: 150px;" size="small" clearable placeholder="请选择任务状态" @change="handleFilter">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <el-tabs v-model="activeName" style="margin:6px 10px 0px 10px;width:100%;height:100%;overflow:hidden" type="border-card">
      <el-tab-pane label="看板" name="kb">
        <board v-if="'kb' == activeName" ref="board" />
      </el-tab-pane>
      <el-tab-pane label="进展" name="jz">
        <chart v-if="'jz' == activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
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
      projectId: '',
      activeName: 'kb',
      options: [
        {
          value: '0',
          label: '未开始'
        },
        {
          value: '1',
          label: '进行中'
        },
        {
          value: '2',
          label: '暂停中'
        },
        {
          value: '3',
          label: '已完成'
        }
      ],
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
  computed: {
    ...mapGetters(['allUserList', 'taskQuery'])
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    this.projectId = this.$route.name.substring(1)

    this.$store.commit('project/RESET_TASK_QUERY')
    this.$store.commit('project/SET_TASK_QUERY', {
      projectId: this.projectId
    })
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  mounted() {},
  methods: {
    // 搜索任务
    handleFilter() {
      console.log(this.taskQuery)
      this.$refs.board.getList()
    }
  }
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
    z-index: 9;
    position: absolute;
    top: 4px;
    left: 180px;
  }
}
</style>

