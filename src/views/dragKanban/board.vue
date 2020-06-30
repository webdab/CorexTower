<template>
  <div class="components-container board" v-loading="isLoading">
    <Kanban v-for="(item,index) in panelList" :key="item.panelId" :list="item.taskList" :group="group" class="kanban todo" :header-text.sync="item.panelTitle" :panel-id="item.panelId" />
    <div v-if="!showEdTitle" class="addList" @click="addList">+添加清单</div>
    <div v-if="showEdTitle" class="edlist">
      <el-input v-model.lazy.trim="listTitle" placeholder="输入清单名称" />
      <el-button type="primary" class="submit" @click="submit">创建清单</el-button>
      <el-button class="cancleSub" @click="()=>showEdTitle=false">取消</el-button>
    </div>
  </div>

</template>

<script>
import Kanban from '@/components/Kanban'
import { fetchPanelList, addPanel, deletePanel, updatePanel } from '@/api/project'
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
export default {
  components: {
    Kanban
  },
  data() {
    return {
      group: 'mission',
      listTitle: '',
      showEdTitle: false,
      projectId: ''
    }
  },
  computed: {
    ...mapGetters(['userId', 'isLoading', 'panelList'])
  },
  created() {
    this.projectId = this.$route.name.substring(1)
  },
  mounted() {
    this.getList()
    this.getUserList()
    console.log('isLoading', this.isLoading)
  },
  methods: {
    getList() {
      var data = {
        projectId: this.projectId
      }
      this.$store.dispatch('project/fetchPanelList', data)
    },
    getUserList() {
      this.$store.dispatch('project/getProgectUserList', this.projectId)
    },
    // 添加清单
    addList() {
      this.showEdTitle = true
      this.listTitle = ''
    },
    // 提交新增清单名称
    submit() {
      this.showEdTitle = false
      if (this.listTitle === '') {
        this.$message({
          message: '清单名称不能为空',
          type: 'error'
        })
      } else {
        var panel = {
          panelTitle: this.listTitle,
          projectId: this.projectId,
          userId: this.userId
        }
        this.listTitle = ''
        addPanel(panel).then(response => {
          console.log('addpanel', response.data)
          if (response.success == true) {
            this.getList()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.components-container {
  margin: 10px 15px;
  position: relative;
}
.board {
  height: calc(100vh - 140px);
  box-sizing: border-box;
  margin-left: 10px;
  margin-bottom: 3px;
  padding-bottom: 5px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  overflow-x: auto;
  .addList {
    min-width: 324px;
    min-height: 60px;
    box-sizing: border-box;
    background: #f0f0f0;
    border-radius: 3px;
    margin: 0 10px;
    border: 1px solid #d9d3d3;
    color: #333;
    line-height: 60px;
    text-align: center;
    white-space: nowrap;
    &:hover {
      background-color: #f7fbfb;
    }
  }
  .edlist {
    min-width: 324px;
    min-height: 100px;
    box-sizing: border-box;
    background: #f0f0f0;
    border-radius: 3px;
    padding: 5px 10px;
    margin: 0 10px;
    border: 1px solid #d9d3d3;
    color: #333;
    .submit {
      margin: 10px 10px;
    }
    .cancleSub {
      margin: 10px 10px;
    }
  }
}
.kanban {
  &.todo {
    .board-column-header {
      background: #efefef;
    }
  }
  .board-column-content {
    border-top: none !important;
  }
}
</style>
