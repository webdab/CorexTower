<template>
  <div class="board-column">
    <div v-if="!showEdTitle" class="board-column-header">
      <span class="num">{{ list.length }}</span>
      <span class="headerText">{{ headerText }}</span>
      <el-tooltip class="item" content="添加任务" placement="left" effect="light">
        <i class="el-icon-plus" @click="addTaskView" />
      </el-tooltip>
      <el-dropdown>
        <i class="el-icon-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editTitle">编辑</el-dropdown-item>
          <el-dropdown-item @click.native="deleteList">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-if="showEdTitle" class="creat-task">
      <el-input v-model="input" :placeholder="`${headerText}`" />
      <el-button type="primary" class="submit" @click="subTitle">提交</el-button>
      <el-button class="cancleSub" @click="subCancle">取消</el-button>
    </div>
    <el-input v-show="showInput" ref="addTackTextarea" v-model.lazy.trim="textarea" class="el-input" :autosize="{ minRows:3}" type="textarea" placeholder="请输入标题，回车创建，ESC取消" @keyup.enter.native="submit" @keyup.esc.native="cancleSubmit" />
    <draggable ref="addTask" :list="list" v-bind="$attrs" class="board-column-content" :set-data="setData" @change="dragEnd">
      <div v-for="(element,index) in list" :key="element.id" class="board-item" :class="[colors[element.taskLevel],{'finish':element.taskStatus == 3}]" @click="getIndex(index,element)">
        <div class="task-header">
          <span class="task-header-title">{{ element.taskName }}</span>
          <i :class="statusClass[element.taskStatus].name" :style="{color:[statusClass[element.taskStatus].color]}" />
        </div>
        <span v-if="element.planStartDate" class="card-time">{{ element.planStartDate&&element.planStartDate.dateFormat("yyyy-mm-dd") }}-{{ element.planEndDate&&element.planEndDate.dateFormat("yyyy-mm-dd") }}</span>
        <span v-if="element.principalName" class="card-other">负责人:&nbsp;{{ element.principalName }}</span>
        <span v-if="element.assistUserList" class="card-other">协作人:&nbsp;{{ element.assistUserList|userNames }}</span>
        <span v-if="element.completePercent" class="card-other">完成百分比:&nbsp;{{ element.completePercent }}% </span>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { deletePanel, updatePanel, addTask, deleteTask, updateTask, addComment, getLog, getComments, updateBatch, getAssistUserList, getTaskDetails } from '@/api/project'
import { string } from 'clipboard'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import '@/utils'
export default {
  name: 'DragKanbanDemo',
  components: {
    draggable
  },
  filters: {
    userNames(value) {
      if (!value) return ''
      const arr = []
      value.forEach(item => {
        arr.push(item.userName)
      })
      return arr.join(',')
    }
  },
  props: {
    headerText: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    panelId: Number
  },
  data() {
    return {
      dangers: [
        {
          color: '#DF3C2F',
          value: 3,
          label: '最高'
        },
        {
          color: '#F5941D',
          value: 2,
          label: '较高'
        },
        {
          color: '#999999',
          value: 1,
          label: '一般'
        },
        {
          color: '#58B837',
          value: 0,
          label: '较低'
        }
      ],
      colors: ['top1', 'top2', 'top3', 'top4'],
      statusClass: [
        { name: 'el-icon-loading', color: '#fc6b04' },
        { name: 'el-icon-video-play', color: '#36a3f7' },
        { name: 'el-icon-video-pause', color: '#f4516c' },
        { name: 'el-icon-success', color: '#34bfa3' }
      ],
      percents: [
        {
          value: '0',
          label: '0%'
        },
        {
          value: '25',
          label: '25%'
        },
        {
          value: '50',
          label: '50%'
        },
        {
          value: '75',
          label: '75%'
        },
        {
          value: '100',
          label: '100%'
        }
      ],
      input: '',
      textarea: '',
      describe: '',
      showEdTitle: false,
      showInput: false,
      centerDialogVisible: false,
      listMenu: [],
      checked: false,
      time: [],
      level: '',
      showEditTitle: false,
      showDescribe: false,
      comments: '',
      percent: '',
      missionTitle: '',
      missionStart: true,
      logs: [],
      commentList: [],
      updateData: {
        assistUserList: [
          // {
          //   createDate: '',
          //   deleteFlag: '',
          //   deptId: '',
          //   deptName: '',
          //   email: '',
          //   gender: '',
          //   loginName: '',
          //   mobile: '',
          //   modifyDate: '',
          //   passwd: '',
          //   userId: 0,
          //   userName: ''
          // }
        ],
        completePercent: '',
        createDate: '',
        deleteFlag: '',
        modifyDate: '',
        optUserId: '',
        optUserName: '',
        panelId: '',
        planCompleteDate: '',
        planEndDate: '',
        planStartDate: '',
        principalId: '',
        principalName: '',
        realCompleteDate: '',
        realEndDate: '',
        realStartDate: '',
        taskCode: '',
        taskId: '',
        taskInfo: '',
        taskLevel: '',
        taskName: '',
        taskStatus: ''
      },
      currentStatus: '0',
      statusText: '未开始',
      taskDetails: {},
      height: ''
    }
  },
  created() {
    // 切换项目清空面板数据
    this.$projectId = this.$route.name.substring(1)
  },
  computed: {
    ...mapGetters(['userId', 'allUserList', 'name'])
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    addTaskView() {
      this.ContainerTimer = setTimeout(() => {
        this.showInput = !this.showInput
        setTimeout(() => {
          // this.$refs.addTask.scrollTop = 0
          this.$refs.addTackTextarea.focus()
        }, 100)
        // 清理定时器
        clearTimeout(this.ContainerTimer)
      }, 0)
    },
    // 任务拖动结束，更新面板
    dragEnd(event) {
      if (event.added) {
        this.list[event.added.newIndex].panelId = this.panelId

        this.updateTaskList(this.list)
      }
      if (event.moved) {
        this.updateTaskList(this.list)
      }
    },
    updateTaskList(list) {
      const response = updateBatch(list)
    },
    getList() {
      this.$store.dispatch('project/fetchPanelList', {
        projectId: this.$projectId
      })
    },
    // 点击列表展示相应的详情
    async getIndex(index, element) {
      this.$store.commit('project/SET_TASK_ID',element.taskId)
      this.$store.commit('project/SET_DIALOG_PAGE',true)
    },
    // 编辑清单名称
    editTitle() {
      this.showEdTitle = !this.showEdTitle
      this.showInput = false
    },
    // 删除清单面板
    deleteList() {
      this.$confirm('确定要删除该面板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const response = await deletePanel(this.panelId)
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 提交任务
    submit: _.debounce(async function() {
      if (this.textarea === '') return
      var task = {
        panelId: this.panelId,
        taskName: this.textarea,
        taskStatus: this.currentStatus,
        optUserId: this.userId,
        projectId: this.$projectId
      }
      const response = await addTask(task)
      if (response.success === true) {
        this.showInput = false
        this.textarea = ''
        this.getList()
      }
    }, 300),
    cancleSubmit() {
      this.textarea = ''
      this.showInput = false
    },
    // 提交修改的清单名称
    async subTitle() {
      try {
        var data = {
          panelTitle: this.input,
          panelId: this.panelId,
          projectId: this.$projectId,
          userId: this.userId
        }
        var response = await updatePanel(data)
        this.$message({
          type: 'success',
          message: response.msg
        })
        this.getList()
      } catch (error) {
        console.log(error)
      }
      this.input = ''
      this.showEdTitle = false
    },
    subCancle() {
      this.showEdTitle = false
      this.input = ''
    },
  }
}
</script>
<style lang="scss" scoped>
.board-column {
  width: 324px;
  min-width: 324px;
  min-height: 100px;
  box-sizing: border-box;
  height: 100%;
  background: #f0f0f0;
  border-radius: 3px;
  margin: 0 5px;

  .board-column-header {
    cursor: move;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 10px;
    color: #000;
    border-radius: 3px 3px 0 0;
    position: relative;
    .num {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border: 1px solid #999999;
      border-radius: 50%;
      background-color: #999999;
      color: #fff;
    }
    .headerText {
      padding-left: 16px;
      position: absolute;
      left: 5px;
      margin-left: 20px;
    }
    .el-icon-plus {
      cursor: pointer;
      display: inline-block;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      position: absolute;
      right: 0;
      margin-right: 30px;
      color: #000;
      vertical-align: middle;
      &:hover {
        color: #1890ff;
      }
    }
    .el-dropdown {
      height: 50px;
      line-height: 50px;
      position: absolute;
      right: 0;
      margin-right: 10px;
      .el-icon-more {
        cursor: pointer;
        display: inline-block;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        position: absolute;
        right: 0;
        vertical-align: middle;
        &:hover {
          color: #1890ff;
        }
      }
    }
  }
  .creat-task {
    padding-bottom: 10px;
    .el-input {
      width: 100%;
      padding: 5px 10px;
      margin: 15px 0 5px 0;
    }
  }
  .el-input {
    width: 100%;
    padding: 5px 10px;
  }
  .submit {
    margin: 0 10px;
  }
  .cancleSub {
    margin: 0 10px;
  }
  .dialog-page {
    width: 1110px;
    height: 80%;
    position: fixed !important;
    // margin-left: 100px;
    top: 50%;
    left: 50%;
    margin-top: 20px;

    transform: translate(-50%, -50%);
    z-index: 200;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #efefef;
    .page-container {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        line-height: 44px;
        padding: 0 24px;
        box-sizing: border-box;
        border-bottom: 1px solid #efefef;
        .left {
          .tack-state {
            color: #555;
            font-size: 12px;
            padding-left: 20px;
            text-shadow: 1px 1px 1px #ccc;
          }
        }
        .right {
          .el-button {
            padding: 4px;
            border: none;
            margin-left: 4px;
          }
          i {
            font-size: 20px;
          }
          .el-icon-video-pause {
            color: #409eff;
          }
          .el-icon-video-play {
            color: #777777;
          }
          .el-icon-delete {
            color: red;
          }
        }
      }
      .modal-content {
        height: calc(100% - 44px);
        padding-left: 10px;
        overflow-y: auto;
        .left-icon {
          width: 50px;
          text-align: center;
        }
        i {
          font-size: 16px;
        }
        .group-title {
          font-size: 14px;
          margin-left: 16px;
          color: #555;
          font-weight: 700;
        }
      }
      .page-content {
        padding: 14px 0;
        border-bottom: 1px solid #efefef;
        display: flex;
        .checkbox {
          width: 30px;
          height: 30px;
          font-size: 24px;
          font-weight: 700;
          line-height: 24px;
        }
        .main-content {
          width: 100%;
          .mission-title {
            width: 100%;
            font-size: 16px;
            font-weight: 700;
            color: #333;
            line-height: 24px;
            vertical-align: baseline;
            border: none;
            outline: none;
            height: auto;
            resize: none;
            background-color: rgba(0, 0, 0, 0);
          }
          .nav {
            width: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #999;
            padding-right: 20px;
            margin-top: 20px;
            // justify-content: space-between;
            align-items: center;
            div {
              cursor: pointer;
            }
            .pro-time {
              .el-input__inner {
                width: 240px;
                font-size: 14px;
              }

              .el-range-input {
                width: 30%;
              }
            }
          }
        }
      }
      .describe {
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 400;
        width: 100%;
        padding: 10px 8px;
        border-bottom: 1px solid #efefef;
        .edit {
          padding: 10px 5px;
          a {
            font-weight: 400;
            color: #999;
            margin: 0 8px;
            &:hover {
              outline-color: #44acb6;
              color: #44acb6;
              text-decoration: none;
            }
          }
        }
        .edit-textarea {
          padding-left: 40px;
        }
      }
      .infos {
        font-size: 14px;
        width: 100%;
        padding: 14px 14px;
        border-bottom: 1px solid #efefef;
        .advance {
          color: #555;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 20px 10px;
          input {
            border: 0;
            outline: none;
            background-color: rgba(0, 0, 0, 0);
            width: 30px;
            font-size: 14px;
          }
          span {
            font-size: 14px;
            padding: 10px 50px 0 5px;
          }
        }
      }
      .comments {
        padding: 16px 14px;
        width: auto;
        border-top: 1px solid #efefef;
        .dynamic {
          font-size: 12px;
          color: #777;
          word-break: break-word;
          padding-bottom: 20px;
          .dynamic-list {
            margin-top: 10px;
            min-height: 20px;
            max-height: 200px;
            overflow-y: auto;
          }
          .dy-content {
            margin: 10px 0px;
            padding-left: 26px;
            .dy-title {
              font-size: 14px;
              padding-bottom: 10px;
              color: #000;
            }
            .dy-time {
              margin: 10px 10px;
              padding-top: 10px;
            }
            .dy-name {
              margin: 10px 10px;
            }
          }
        }
        .comment-info {
          font-size: 12px;
          color: #777;
          padding-top: 10px;
          .comment-info-list {
            margin-top: 10px;
            min-height: 20px;
            max-height: 200px;
            overflow-y: auto;
          }
          .com-title {
            font-size: 14px;
            padding-bottom: 10px;
            color: #000;
          }
          .com-content {
            margin: 10px 0;
            padding-left: 26px;
            .com-name {
              margin: 10px 10px;
            }
            .com-time {
              margin: 10px 10px;
            }
            .com-info {
              margin: 0 10px;
            }
          }
        }
        .edit-comment {
          padding-top: 50px;
          span {
            width: 100%;
            height: 60px;
            font-size: 14px;
            line-height: 60px;
            text-align: center;
            vertical-align: baseline;
          }
          .el-textarea {
            margin-left: 12px;
            width: 80%;
            min-height: 0;
            height: 60px;
            box-sizing: border-box;
            border: 0;
            padding: 10px 15px;
            font-size: 16px;
            color: #999;
            line-height: 28px;
          }
          .com-commit {
            margin-left: 60px;
            padding: 16px 15px;
          }
        }
      }
    }
  }
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  .board-column-content {
    height: calc(100% - 50px);
    overflow-y: auto;
    border: 4px solid transparent;
    padding: 6px;
    .board-item {
      cursor: pointer;
      width: 100%;
      min-height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 2em;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      border-top: 1px solid #e3e3e3;
      border-right: 1px solid #e3e3e3;
      border-bottom: 1px solid #e3e3e3;
      &:hover {
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
      }
      .task-header {
        .task-header-title {
          word-wrap: break-word;
        }
        i {
          float: right;
          padding: 2px 8px;
          line-height: 18px;
          text-align: center;
          margin-top: 2px;
        }
      }
      p {
        margin: 0;
        padding: 0;
        color: #3d3d3d;
      }
      .card-other {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 4px;
        font-size: 12px;
        line-height: 16px;
        color: #999;
      }
      .card-time {
        margin-top: 0;
        display: inline-block;
        background-color: #f9d8d5;
        border: 1px solid #ee7a71;
        border-radius: 10px;
        color: #df3c2f;
        padding: 2px 8px;
        font-size: 12px;
        line-height: 18px;
      }
    }
    .finish {
      background-color: #eee;
    }
    .top1 {
      border-left-width: 4px;
      border-left-style: solid;
      border-left-color: #58b837;
    }
    .top2 {
      border-left-width: 4px;
      border-left-style: solid;
      border-left-color: #999999;
    }
    .top3 {
      border-left-width: 4px;
      border-left-style: solid;
      border-left-color: #f5941d;
    }
    .top4 {
      border-left-width: 4px;
      border-left-style: solid;
      border-left-color: #df3c2f;
    }
  }
}
</style>

