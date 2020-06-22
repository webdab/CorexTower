<template>
  <div class="home-container">
    <!-- 分组面板 -->
    <panel-group />
    <!-- 团队/项目列表 -->
    <el-row :gutter="32">
      <el-col :span="12">
        <div class="overview-wrapper">
          <panel-team />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="overview-wrapper">
          <panel-project />
        </div>
      </el-col>
    </el-row>
    <!-- 图表部分 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <panel-chart />
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PanelChart from './components/PanelChart'
import PanelTeam from './components/PanelTeam'
import PanelProject from './components/PanelProject'

export default {
  name: 'Home',
  components: {
    PanelGroup,
    PanelChart,
    PanelTeam,
    PanelProject
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .overview-wrapper {
    background: #fff;
    padding: 4px;
    margin-bottom: 32px;
    height: 400px;
  }
}
</style>
