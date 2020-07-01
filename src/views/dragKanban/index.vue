<template>
  <div class="tab-wrapper">
    <el-tabs v-model="activeName" style="margin:10px 10px 0px 10px;width:100%;height:100%;overflow:hidden" type="border-card">
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
      activeName: 'kb'
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
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
    height: 100%;
    overflow: hidden;
    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }
  .el-tabs__item {
    height: 30px;
    line-height: 30px;
  }
}
</style>

