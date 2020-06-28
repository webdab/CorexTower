<template>
  <div class="board-column">
    <div v-if="!showEdTitle" class="board-column-header">
      <span class="num">{{ list.length }}</span>
      <span class="headerText">{{ headerText }}</span>
      <i class="el-icon-plus" @click="()=>showInput = true" />
      <el-dropdown>
        <i class="el-icon-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editTitle">编辑</el-dropdown-item>
          <el-dropdown-item @click.native="deleteList">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-if="showEdTitle">
      <el-input v-model="input" :placeholder="`${headerText}`" />
      <el-button type="primary" class="submit" @click="subTitle">提交</el-button>
      <el-button class="cancleSub" @click="subCancle">取消</el-button>
    </div>
    <el-input v-show="showInput" v-model="textarea" class="el-input" :autosize="{ minRows:3}" type="textarea" placeholder="请输入标题，回车创建，ESC取消" @keyup.enter.native="submit" @keyup.esc.native="cancleSubmit" />
    <draggable :list="list" v-bind="$attrs" class="board-column-content" :set-data="setData">
      <div v-for="(element,index) in list" :key="element.id" class="board-item" @click="getIndex(index,element)">
        {{ element.taskName }}
        <span>截止时间:{{element.planStartDate}}-{{element.planEndDate}}</span>
        <span>负责人:-</span>
        <span>协作人:-</span>
        <span>完成百分比:{{element.completePercent}}%</span>
      </div>
    </draggable>
    <div v-show="centerDialogVisible" class="dialog-page">
      <div class="page-container">
        <div class="page-header">
          <div class="left">
            <span>项目名称</span>
            <i class="el-icon-arrow-right" />
            <span>{{ headerText }}</span>
          </div>
          <div class="right">
            <i v-show="!missionStart" class="el-icon-video-pause" @click="changeMissionStatus('pause')" />
            <i v-show="missionStart" class="el-icon-video-play" @click="changeMissionStatus('play')" />
            <i class="el-icon-delete" @click="deleteMission" />
            <i class="el-icon-close" @click="()=>centerDialogVisible=false" />
          </div>
        </div>
        <div class="page-content">
          <input class="checkbox" type="checkbox" :checked="checked" @change="changeMissionStatus('check')">
          <div class="main-content">
            <input v-model="missionTitle" type="text" @blur.capture="submitMissionTitle">
            <div class="nav">
              <div>
                <i class="el-icon-user" />
                <el-select v-model="leader" filterable size="mini" placeholder="添加负责人">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
              <div>
                <svg-icon icon-class="peoples" />
                <el-select v-model="collaborators" filterable multiple collapse-tags size="mini" placeholder="添加协作人">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
              <div class="pro-time">
                <el-date-picker v-model="time" size="mini" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" @change="setTimeRound" />
              </div>
              <div>
                <i class="el-icon-warning-outline" />
                <el-select v-model="level" size="mini" placeholder="优先级" @change="submitLevel">
                  <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value">
                    <span>{{ item.label }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="describe">
          <div class="edit">
            <i class="el-icon-document" />
            <span>添加任务描述</span>
            <a @click="()=>showDescribe=true">编辑</a>
          </div>
          <div v-show="showDescribe">
            <el-input v-model="describe" type="textarea" :rows="4" placeholder="请输入内容" />
            <el-button type="primary" size="small" style="margin-top:5px" @click="saveDescribe">提交</el-button>
            <el-button type="info" size="small" style="margin-top:5px" @click="()=>showDescribe=false">取消</el-button>
          </div>
          <p v-show="!showDescribe" style="margin-top:-2px;font-size:14px;line-height:20px;margin-left:15px">{{ list[currentIndex] ? list[currentIndex].taskInfo:'' }}</p>
        </div>
        <div class="infos">
          <div>
            <i class="el-icon-postcard" />
            <span>任务详情</span>
          </div>
          <div class="advance">
            <span>完成百分比%</span>
            <el-select v-model="percent" placeholder="请选择" @change="submitPercent">
              <el-option v-for="item in percents" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="comments">
          <div class="dynamic">
            <div class="dy-title">
              <i class="el-icon-edit" />
              <span>操作日志</span>
            </div>
            <div class="dy-content" v-for="item in logs" :key="item.logId">
              <span class="dy-time">{{item.optDate}}</span>
              <span class="dy-name">用户</span>
              <span class="dy-info">{{item.optContent}}</span>
            </div>
          </div>
          <div class="comment-info">
            <div class="com-title">
              <i class="el-icon-chat-line-round" />
              <span>评论区</span>
            </div>
            <div class="com-content" v-for="item in commentList" :key="item.commentId">
              <span class="com-time">{{item.createDate}}</span>
              <span class="com-name">用户</span>
              <span>发表评论</span>
              <span class="com-info">{{item.commentInfo}}</span>
            </div>
          </div>
          <div class="edit-comment">
            <span>Bubble</span>
            <el-input v-model="comments" type="textarea" :rows="1" placeholder="点击发表评论" />
            <div class="com-commit">
              <el-button type="primary" size="small" @click="commitComment">发表评论</el-button>
              <el-button type="info" size="small">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="centerDialogVisible" class="mask" style="display: none;" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { deletePanel, updatePanel, addTask, deleteTask, updateTask, addComment, getLog, getComments } from '@/api/project'
import { string } from 'clipboard'
export default {
  name: 'DragKanbanDemo',
  components: {
    draggable
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
      options1: [
        {
          value: 'Beijing',
          label: '北京'
        },
        {
          value: 'Shanghai',
          label: '上海'
        },
        {
          value: 'Nanjing',
          label: '南京'
        },
        {
          value: 'Chengdu',
          label: '成都'
        },
        {
          value: 'Shenzhen',
          label: '深圳'
        },
        {
          value: 'Guangzhou',
          label: '广州'
        }
      ],
      dangers: [
        {
          value: 'top1',
          label: '最高'
        },
        {
          value: 'top2',
          label: '较高'
        },
        {
          value: 'top3',
          label: '一般'
        },
        {
          value: 'top4',
          label: '较低'
        }
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
      leader: '',
      collaborators: [], // 协作人员
      level: '',
      showEditTitle: false,
      showDescribe: false,
      comments: '',
      percent: '',
      missionTitle: '',
      missionStart: true,
      currentIndex: '',
      logs: [],
      commentList: []
    }
  },
  watch: {
    currentTitle: {
      handler: function(newValue) {
        this.$emit('update:header-text', newValue)
      },
      deep: true
    }
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    getList() {
      var data = {
        projectId: 1,
        userId: 1
      }
      this.$store.dispatch('project/fetchPanelList', data)
    },
    // 编辑清单名称
    editTitle() {
      this.showEdTitle = !this.showEdTitle
      this.showInput = false
    },
    // 删除清单面板
    async deleteList() {
      const response = await deletePanel(this.panelId)
      this.$message({
        type: 'success',
        message: response.msg
      })
      this.getList()
    },
    // 改变任务的状态：开始任务、暂停任务、完成任务
    changeMissionStatus(type) {
      if (type === 'pause') {
        this.missionStart = !this.missionStart
      } else if (type === 'play') {
        this.missionStart = !this.missionStart
      } else if (type === 'check') {
        this.checked = !this.checked
      }
    },
    // 删除该条任务
    deleteMission() {
      this.$confirm('确定要删除该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log('currentIndex', this.list[this.currentIndex].taskId)
          const response = await deleteTask(this.list[this.currentIndex].taskId)
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (response.success === true) {
              this.getList()
            }
            this.centerDialogVisible = false
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
    async submit() {
      this.showInput = false
      var data = {
        panelId: this.panelId,
        taskName: this.textarea
      }
      const response = await addTask(data)
      if (response.success === true) {
        this.getList()
      }
      this.textarea = ''
    },
    cancleSubmit() {
      this.textarea = ''
      this.showInput = false
    },
    // 提交修改的清单名称
    async subTitle() {
      console.log('修改了title', this.input)
      try {
        var data = {
          panelTitle: this.input,
          panelId: this.panelId,
          projectId: 1,
          userId: 1
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
    // 点击列表展示相应的详情
    async getIndex(index, element) {
      this.centerDialogVisible = true
      this.missionTitle = element.taskName
      this.currentIndex = index
      this.percent = element.completePercent ? String(element.completePercent) : ''
      this.time=[]
      this.time.push(element.planStartDate ? String(element.planStartDate) : '')
      this.time.push(element.planEndDate ? String(element.planEndDate) : '')
      this.describe = element.taskInfo ? element.taskInfo : ''
      console.log('time', this.time)
      var logData = {
        current: 1,
        paramObj: {
          taskId: this.list[this.currentIndex].taskId
        },
        size: 10
      }
      var commentData = {
        current: 1,
        paramObj: {
          taskId: this.list[this.currentIndex].taskId,
          userId: 1
        },
        size: 10
      }
      // 获取操作日志
      const logResponse = await getLog(logData)
      if (logResponse.success === true) {
        this.logs = logResponse.data.records
      }
      // 获取评论列表
      const commentResponse = await getComments(commentData)
      if (commentResponse.success === true) {
        this.commentList = commentResponse.data.records
      }
    },
    // 保存项目描述
    async saveDescribe() {
      var taskData = {
        panelId: this.panelId,
        taskId: this.list[this.currentIndex].taskId,
        taskInfo: this.describe
      }
      const response = await updateTask(taskData)
      if (response.success === true) {
        this.showDescribe = false
        this.describe = ''
        this.getList()
      }
    },
    // 设置任务标题
    async submitMissionTitle() {
      var taskData = {
        panelId: this.panelId,
        taskId: this.list[this.currentIndex].taskId,
        taskName: this.missionTitle
      }
      const response = await updateTask(taskData)
      if (response.success === true) {
        this.getList()
      }
    },
    /*
    项目开始时间与结束时间
     */
    async setTimeRound() {
      var timeData = {
        panelId: this.panelId,
        planStartDate: this.time != null && this.time[0],
        planEndDate: this.time != null && this.time[1],
        taskId: this.list[this.currentIndex].taskId
      }
      if (this.time == null) return
      const response = await updateTask(timeData)
      if (response.success === true) {
        this.getList()
      }
    },
    // 设置项目进度百分比
    async submitPercent() {
      console.log('precent', this.percent)
      var percentData = {
        completePercent: this.percent,
        panelId: this.panelId,
        taskId: this.list[this.currentIndex].taskId,
        taskName: this.missionTitle
      }
      const response = await updateTask(percentData)
      if (response.success === true) {
        this.getList()
      }
    },
    // 发表评论
    async commitComment() {
      var commentData = {
        commentInfo: this.comments,
        taskId: this.list[this.currentIndex].taskId,
        userId: 1
      }
      console.log('commentData', commentData)
      const response = await addComment(commentData)
      if (response.success === true) {
        this.comments = ''
        var logData = {
          current: 1,
          paramObj: {
            taskId: this.list[this.currentIndex].taskId
          },
          size: 10
        }
        const commentResponse = await getComments(commentData)
        if (commentResponse.success === true) {
          this.commentList = commentResponse.data.records
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.board-column {
  min-width: 324px;
  min-height: 100px;
  box-sizing: border-box;
  height: 100%;
  background: #f0f0f0;
  border-radius: 3px;
  margin: 0 5px;
  overflow-y: auto;
  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 10px;
    background: #333;
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
      display: inline-block;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      position: absolute;
      right: 0;
      margin-right: 30px;
      color: #000;
      vertical-align: middle;
    }
    .el-dropdown {
      height: 50px;
      line-height: 50px;
      position: absolute;
      right: 0;
      margin-right: 10px;
      .el-icon-more {
        display: inline-block;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        position: absolute;
        right: 0;
        vertical-align: middle;
      }
    }
  }
  .el-input {
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    padding: 5px 10px;
    margin: 5px 0;
  }
  .submit {
    margin: 0 10px;
  }
  .cancleSub {
    margin: 0 10px;
  }
  .dialog-page {
    width: 1110px;
    height: 70%;
    position: fixed;
    margin-left: 100px;
    top: 50%;
    left: 50%;
    margin-top: 20px;
    transform: translate(-50%, -50%);
    z-index: 200;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #efefef;
    overflow-y: auto;
    .page-container {
      height: auto;
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
        .right {
          i {
            margin: 0 8px;
          }
          .el-icon-video-pause {
            color: #409eff;
          }
          .el-icon-video-play {
            color: #409eff;
          }
          .el-icon-delete {
            color: red;
          }
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
          font-weight: 400;
          line-height: 24px;
          margin: 0 14px;
        }
        .main-content {
          width: 100%;
          input {
            padding: 3px 0;
            font-size: 20px;
            line-height: 24px;
            vertical-align: baseline;
            border: 0;
            outline: none;
            background-color: rgba(0, 0, 0, 0);
          }
          .nav {
            width: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #999;
            padding-right: 20px;
            margin-top: 10px;
            justify-content: space-between;
            align-items: center;
            div {
              cursor: pointer;
            }
            .pro-time {
              .el-input__inner[data-v-d5a341ac] {
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
          .dy-content {
            margin: 10px 0px;
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
          .com-title {
            font-size: 14px;
            padding-bottom: 10px;
            color: #000;
          }
          .com-content {
            margin: 10px 0;
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
            font-size: 14px;
            line-height: 28px;
            text-align: center;
            vertical-align: baseline;
          }
          .el-textarea {
            margin-left: 12px;
            width: 80%;
            min-height: 0;
            height: 48px;
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
    border: 10px solid transparent;
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
      border-left: 2px solid red;
      span {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 4px;
        font-size: 12px;
        line-height: 16px;
        color: #999;
      }
    }
  }
}
</style>

