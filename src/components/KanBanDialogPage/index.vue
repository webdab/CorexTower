<template>
  <div class="board-column">
    <!-- modal -->
    <div class="dialog-page">
      <div class="page-container">
        <div class="page-header">
          <div class="left">
            <span>{{$route.meta.title}}</span>
            <i class="el-icon-arrow-right" />
            <span>{{ headerText }}</span>
            <span class="tack-state">{{ statusText }}</span>
          </div>
          <div class="right">
            <el-tooltip class="item" effect="dark" content="暂停任务" placement="bottom">
              <el-button v-show="!missionStart" circle size="mini"> <i class="el-icon-video-pause" @click="changeMissionStatus('pause')" /></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="开始任务" placement="bottom">
              <el-button v-show="missionStart" circle size="mini"> <i class="el-icon-video-play" @click="changeMissionStatus('play')" /></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除任务" placement="bottom">
              <el-button circle size="mini"> <i class="el-icon-delete" @click="deleteMission" /></el-button>
            </el-tooltip>
            <el-button circle size="mini"> <i class="el-icon-close" @click="closeMission" /></el-button>
          </div>
        </div>
        <div class="modal-content">
          <div class="page-content">
            <div class="left-icon">
              <input class="checkbox" type="checkbox" :checked="checked" @change="changeMissionStatus('check')">
            </div>
            <div class="main-content">
              <textarea class="mission-title" v-model.trim="missionTitle" ref="missionText" :style="{'height': height}"  @blur.capture="submitMissionTitle" @keydown.enter="submitMissionTitle" @input="handleInput" />
              <!-- 负责人、协作人、日期、等级 -->
              <div class="nav">
                <div>
                  <i class="el-icon-user-solid" />
                  <el-select v-model="updateData.principalName" filterable size="mini" placeholder="添加负责人" clearable @change="changeTaskInfo('leader')">
                    <el-option v-for="item in allUserList" :key="item.userId" :label="item.userName" :value="item.userId" />
                  </el-select>
                </div>
                <div style="margin-left:30px">
                  <svg-icon icon-class="peoples" />
                  <el-select v-model="updateData.assistUserList" value-key="userId" filterable multiple collapse-tags size="mini" placeholder="添加协作人" clearable @change="changeTaskInfo('assistUser')">
                    <el-option v-for="item in allUserList" :key="item.userId" :label="item.userName" :value="item" />
                  </el-select>
                </div>
                <div class="pro-time" style="margin-left:30px">
                  <el-date-picker v-model="time" size="mini" :clearable="false" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" @change="setTimeRound" />
                </div>
                <div style="margin-left:30px">
                  <i class="el-icon-warning-outline" />
                  <el-select v-model="level" size="mini" placeholder="优先级" @change="submitLevel">
                    <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value">
                      <span :style="{'color':item.color}">{{ item.label }}</span>
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div class="describe">
            <div class="edit">
              <i class="el-icon-document" />
              <span class="group-title">任务描述</span>
              <a @click="()=>showDescribe=true">编辑</a>
            </div>
            <div v-show="showDescribe" class="edit-textarea">
              <el-input v-model="describe" type="textarea" :rows="4" placeholder="请输入内容" />
              <el-button type="primary" size="small" style="margin-top:5px" @click="saveDescribe">提交</el-button>
              <el-button type="info" size="small" style="margin-top:5px" @click="()=>showDescribe=false">取消</el-button>
            </div>
            <p v-show="!showDescribe" style="margin-top:-2px;font-size:14px;line-height:20px;margin-left:40px;color:#777">{{ updateData.taskInfo ? updateData.taskInfo:'' }}</p>
          </div>
          <div class="infos">
            <div>
              <i class="el-icon-postcard" />
              <span class="group-title">任务详情</span>
            </div>
            <div class="advance">
              <span style="margin-left:20px">完成百分比%</span>
              <el-select v-model="percent" placeholder="请选择" @change="submitPercent">
                <el-option v-for="item in percents" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
          <div class="comments">
            <div class="dynamic">
              <div class="dy-title">
                <i class="el-icon-edit" />
                <span class="group-title">操作日志</span>
              </div>
              <div class="dynamic-list">
                <div v-for="item in logs" :key="item.logId" class="dy-content">
                  <span class="dy-time">{{ item.optDate }}</span>
                  <span class="dy-name">{{ item.userName }}</span>
                  <span class="dy-info">{{ item.optContent }}</span>
                </div>
              </div>
            </div>
            <div class="comment-info">
              <div class="com-title">
                <i class="el-icon-chat-line-round" />
                <span class="group-title">评论区</span>
              </div>
              <div class="comment-info-list">
                <div v-for="item in commentList" :key="item.commentId" class="com-content">
                  <span class="com-time">{{ item.createDate }}</span>
                  <span class="com-name">{{ item.userName }}</span>
                  <span>发表评论</span>
                  <span class="com-info">{{ item.commentInfo }}</span>
                </div>
              </div>
            </div>
            <div class="edit-comment">
              <span>{{ name }}</span>
              <el-input v-model="comments" type="textarea" :rows="1" placeholder="点击发表评论" />
              <div class="com-commit">
                <el-button type="primary" size="small" @click="commitComment">发表评论</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="showDialogPage" class="mask" style="display: none;" />
  </div>
</template>
<script>
import { deletePanel, updatePanel, addTask, deleteTask, updateTask, addComment, getLog, getComments, updateBatch, getAssistUserList, getTaskDetails } from '@/api/project'
import { string } from 'clipboard'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import '@/utils'
export default {
  name: 'KanbanDialog',
  components: {},
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
        assistUserList: [],
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
    this.getTaskInfo()
  },
  computed: {
    ...mapGetters(['userId', 'allUserList', 'name', 'taskId','showDialogPage'])
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
    handleInput(e) {
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight + 'px'
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
    async getTaskInfo() {
      //获取任务详情
      const infoResponse = await getTaskDetails(this.taskId)
      if (infoResponse.success === true) {
        this.missionTitle = infoResponse.data.taskName
        this.percent = infoResponse.data.completePercent ? String(infoResponse.data.completePercent) : ''
        this.time = []
        this.time.push(infoResponse.data.planStartDate ? String(infoResponse.data.planStartDate) : '')
        this.time.push(infoResponse.data.planEndDate ? String(infoResponse.data.planEndDate) : '')
        this.describe = infoResponse.data.taskInfo ? infoResponse.data.taskInfo : ''

        if (infoResponse.data.taskLevel === 0 || !infoResponse.data.taskLevel) {
          this.level = infoResponse.data.taskLevel === 0 ? 0 : ''
        } else {
          this.level = infoResponse.data.taskLevel
        }

        if (infoResponse.data.principalName) this.updateData.principalName = infoResponse.data.principalName
        if (infoResponse.data.assistUserList != '') this.updateData.assistUserList = infoResponse.data.assistUserList
        if (infoResponse.data.taskStatus === '1') {
          if (this.checked) {
            this.checked = !this.checked
          }
          this.missionStart = false
          this.statusText = '进行中'
        } else if (infoResponse.data.taskStatus === '2') {
          if (this.checked) this.checked = !this.checked
          this.missionStart = true
          this.statusText = '暂停中'
        } else if (infoResponse.data.taskStatus === '3') {
          if (!this.checked) {
            this.checked = !this.checked
          }
          this.missionStart = true
          this.statusText = '已完成'
        }
        this.updateData.assistUserList.userName = this.name
        this.updateData.panelId = this.panelId
        this.updateData.taskId = infoResponse.data.taskId
        if (infoResponse.data.taskInfo != undefined) this.updateData.taskInfo = infoResponse.data.taskInfo
        if (infoResponse.data.taskName != undefined) this.updateData.taskName = infoResponse.data.taskName
        if (infoResponse.data.taskInfo != undefined) this.updateData.taskInfo = infoResponse.data.taskInfo
        if (infoResponse.data.planStartDate != undefined) this.updateData.planStartDate = this.time[0]
        if (infoResponse.data.planEndDate != undefined) this.updateData.planEndDate = this.time[1]
        if (infoResponse.data.completePercent != undefined) this.updateData.completePercent = this.percent
        if (infoResponse.data.taskStatus != undefined) this.updateData.taskStatus = this.currentStatus
        if (infoResponse.data.principalId != undefined) this.updateData.principalId = infoResponse.data.principalId
        if (infoResponse.data.assistUserList != undefined) this.updateData.assistUserList = infoResponse.data.assistUserList
        // 获取操作日志
        this.getLogList()
        // 获取评论列表
        this.getCommentsList()
      }
    },
    // 关闭任务详情框
    closeMission() {
      this.$store.commit('project/SET_DIALOG_PAGE', false)
      Object.assign(this.$data, this.$options.data())
    },
    // 获取操作日志
    async getLogList() {
      const logResponse = await getLog(this.updateData.taskId)
      if (logResponse.success === true) {
        this.logs = logResponse.data
      }
    },
    // 获取评论列表
    async getCommentsList() {
      const commentResponse = await getComments(this.updateData.taskId)
      if (commentResponse.success === true) {
        this.commentList = commentResponse.data
      }
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
    // 改变任务的状态：初始状态0、开始任务1、暂停任务2、完成任务3
    async changeMissionStatus(type) {
      if (type === 'pause') {
        this.missionStart = !this.missionStart
        this.currentStatus = '2'
        this.statusText = '暂停中'
        if (this.checked) this.checked = !this.checked
        const response = await updateTask({
          panelId: this.panelId,
          taskId: this.updateData.taskId,
          userId: this.userId,
          optUserId: this.userId,
          userName: this.name,
          taskStatus: this.currentStatus
        })
        if (response.success === true) {
          this.getLogList()
          this.getList()
        }
      } else if (type === 'play') {
        this.missionStart = !this.missionStart
        this.currentStatus = '1'
        this.statusText = '进行中'
        if (this.checked) this.checked = !this.checked
        const response = await updateTask({
          panelId: this.panelId,
          taskId: this.updateData.taskId,
          userId: this.userId,
          optUserId: this.userId,
          userName: this.name,
          taskStatus: this.currentStatus
        })
        if (response.success === true) {
          this.getLogList()
          this.getList()
        }
      } else if (type === 'check') {
        if (this.checked) {
          this.missionStart = false
          this.currentStatus = '1'
          this.checked = !this.checked
          this.statusText = '进行中'
        } else {
          this.currentStatus = '3'
          this.statusText = '已完成'
          this.missionStart = true
          this.checked = !this.checked
        }
        const response = await updateTask({
          panelId: this.panelId,
          taskId: this.updateData.taskId,
          userId: this.userId,
          optUserId: this.userId,
          userName: this.name,
          taskStatus: this.currentStatus
        })
        if (response.success === true) {
          this.getLogList()
          this.getList()
        }
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
          const response = await deleteTask(this.updateData.taskId)
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (response.success === true) {
              this.getList()
            }
            this.$store.commit('project/SET_DIALOG_PAGE', false)
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
    // 保存项目描述
    async saveDescribe() {
      const response = await updateTask({
        panelId: this.panelId,
        taskId: this.updateData.taskId,
        userId: this.userId,
        taskInfo: this.describe
      })
      if (response.success === true) {
        this.showDescribe = false
        this.getList()
        this.getTaskInfo()
      }
    },
    // 设置任务标题
    async submitMissionTitle(e) {
      if (this.missionTitle.trim() !== this.updateData.taskName.trim()) {
        // 浏览器阻止默认事件
        if (event.keyCode === 13) {
          if (e.preventDefault) e.preventDefault()
          else window.event.value = false
        }
        const response = await updateTask({
          panelId: this.panelId,
          taskId: this.updateData.taskId,
          userId: this.userId,
          taskName: this.missionTitle.trim()
        })
        if (response.success === true) {
          this.getList()
          this.$nextTick(() => {
            this.$refs.missionText.blur()
          })
        }
      }
    },
    // 修改任务详情
    async changeTaskInfo(type) {
      var data = {}
      if (type === 'leader') {
        var principalName = this.allUserList.find(item => {
          return item.userId === this.updateData.principalName
        })
        data = {
          panelId: this.panelId,
          taskId: this.updateData.taskId,
          userId: this.userId,
          principalId: this.updateData.principalName,
          principalName: principalName.userName
        }
      }
      if (type === 'assistUser') {
        data = {
          panelId: this.panelId,
          taskId: this.updateData.taskId,
          userId: this.userId,
          assistUserList: this.updateData.assistUserList,
          projectId: this.$projectId,
          isUpdateAssist: true
        }
      }
      const response = await updateTask(data)
      if (response.success === true) {
        this.getList()
      }
    },
    // 项目开始时间与结束时间
    async setTimeRound() {
      if (this.time == null) return
      const response = await updateTask({
        panelId: this.panelId,
        taskId: this.updateData.taskId,
        planStartDate: this.time[0],
        planEndDate: this.time[1],
        userId: this.userId
      })
      if (response.success === true) {
        this.getList()
      }
    },
    // 修改任务等级
    async submitLevel() {
      const response = await updateTask({
        panelId: this.panelId,
        taskId: this.updateData.taskId,
        userId: this.userId,
        taskLevel: this.level
      })
      if (response.success === true) {
        this.getList()
      }
    },
    // 设置项目进度百分比
    async submitPercent() {
      const response = await updateTask({
        panelId: this.panelId,
        taskId: this.updateData.taskId,
        userId: this.userId,
        completePercent: this.percent
      })
      if (response.success === true) {
        this.getList()
      }
    },
    // 发表评论
    async commitComment() {
      if (this.comments === '') return
      const response = await addComment({
        panelId: this.panelId,
        taskId: this.updateData.taskId,
        userId: this.userId,
        userName: this.name,
        commentInfo: this.comments
      })
      if (response.success === true) {
        this.comments = ''
        this.getCommentsList()
      }
    }
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

