<template>
  <div class="tab-wrapper">
    <el-tabs v-model="activeName" style="margin:10px 10px 0px 10px;width:100%;height:100%;overflow:hidden" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <board v-if="'kb'==item.key" :type="item.key" />
          <chart v-if="'jz'==item.key" :type="item.key" />
        </keep-alive>
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
      tabMapOptions: [
        { label: '看板', key: 'kb' },
        { label: '进展', key: 'jz' }
      ]
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    console.log(this.$route.name.substring(1))
    // init the default selected tab
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

