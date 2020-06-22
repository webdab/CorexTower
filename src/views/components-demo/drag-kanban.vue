<template>
  <el-tabs v-model="activeName" style="margin:10px;height:100%" type="border-card">
    <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
      <keep-alive>
        <board v-if="'kb'==item.key" :type="item.key" />
        <chart v-if="'jz'==item.key" :type="item.key" />
      </keep-alive>
    </el-tab-pane>
  </el-tabs>

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
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {}
}
</script>
<style lang="scss">
.el-tabs__item {
  height: 30px;
  line-height: 30px;
}
.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
</style>

