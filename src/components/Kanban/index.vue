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
        {{ element.name }}
        <span>截止时间:2020/6/15-2020/6/20</span>
        <span>负责人:Candy</span>
        <span>协作人：李雷、韩梅梅、张扬</span>
        <span>完成百分比:100%</span>
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
            <i class="el-icon-video-pause" v-show="!missionStart" @click="()=>missionStart=!missionStart" />
            <i class="el-icon-video-play" v-show="missionStart" @click="()=>missionStart=!missionStart" />
            <i class="el-icon-delete" @click="deleteMission" />
            <i class="el-icon-close" @click="()=>centerDialogVisible=false" />
          </div>
        </div>
        <div class="page-content">
          <input class="checkbox" type="checkbox" :checked="checked">
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
                <el-date-picker v-model="time" size="mini" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" />
              </div>
              <div>
                <i class="el-icon-warning-outline" />
                <el-select v-model="level" size="mini" placeholder="优先级">
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
            <el-input v-model="textarea" type="textarea" :rows="4" placeholder="请输入内容" />
            <el-button type="primary" size="small" style="margin-top:5px" @click="saveDescribe">提交</el-button>
            <el-button type="info" size="small" style="margin-top:5px" @click="()=>showDescribe=false">取消</el-button>
          </div>
          <p v-show="!showDescribe" style="margin-top:-2px;font-size:14px;line-height:20px;margin-left:15px">{{ textarea }}</p>
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
            <span class="dy-time">06-18 10:28</span>
            <span class="dy-name">Bubble</span>
            <span class="dy-info">完成了任务</span>
          </div>
          <div class="comment-info">
            <div class="com-title">
              <i class="el-icon-chat-line-round" />
              <span>评论区</span>
            </div>
            <span class="com-time">06-18 10:28</span>
            <span class="com-name">Bubble</span>
            <span>发表评论</span>
            <span class="com-info">2222222</span>
          </div>
          <div class="edit-comment">
            <span>Bubble</span>
            <el-input v-model="comments" type="textarea" :rows="1" placeholder="点击发表评论" />
            <div class="com-commit">
              <el-button type="primary" size="small">发表评论</el-button>
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
    }
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
          value: '选项一',
          label: '0%'
        },
        {
          value: '选项二',
          label: '25%'
        },
        {
          value: '选项三',
          label: '50%'
        },
        {
          value: '选项四',
          label: '75%'
        },
        {
          value: '选项五',
          label: '100%'
        }
      ],
      input: '',
      textarea: '',
      showEdTitle: false,
      showInput: false,
      centerDialogVisible: false,
      listMenu: [],
      currentTitle: this.headerText,
      checked: false,
      time: [],
      leader: '',
      collaborators: [], // 协作人员
      level: '',
      showEditTitle: false,
      showDescribe: false,
      comments: '',
      percent: '0',
      missionTitle: '',
      missionStart: true
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
    editTitle() {
      this.showEdTitle = !this.showEdTitle
    },
    // 删除清单
    deleteList() {},
    deleteMission() {
      this.$confirm('确定要删除该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 提交任务
    submit() {
      this.showInput = false
      this.listMenu = this.list.unshift({
        name: this.textarea
      })
      this.textarea = ''
      console.log('list', this.list)
    },
    cancleSubmit() {
      this.textarea = ''
      this.showInput = false
    },
    subTitle() {
      console.log('修改了title', this.input)
      this.currentTitle = this.input
      this.input = ''
      this.showEdTitle = false
    },
    subCancle() {
      this.showEdTitle = false
      this.input = ''
    },
    // 点击列表展示相应的详情页
    getIndex(index, element) {
      this.centerDialogVisible = true
      this.missionTitle = element.name
    },
    saveDescribe() {
      this.showDescribe = false
    },
    // 设置任务标题
    submitMissionTitle() {
      this.listMenu = this.list.unshift({
        name: this.missionTitle
      })
    },
    // 设置项目进度百分比
    submitPercent() {
      console.log('precent', this.percent)
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
  margin: 0 10px;
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
    width: 80%;
    height: 80%;
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
          margin: 0 16px;
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
        padding: 10px 10px;
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
        padding: 14px 10px;
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
        padding: 16px 10px;
        width: auto;
        border-top: 1px solid #efefef;
        .dynamic {
          font-size: 12px;
          color: #777;
          word-break: break-word;
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
        .comment-info {
          font-size: 12px;
          color: #777;
          word-break: break-word;
          padding-top: 10px;
          .com-title {
            font-size: 14px;
            padding-bottom: 10px;
            color: #000;
          }
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
    height: calc(100%-50px);
    overflow-y: auto;
    border: 10px solid transparent;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
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
        max-width: 200px;
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

