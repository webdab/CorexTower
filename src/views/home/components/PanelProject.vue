<template>
  <div class="projectlist-component">
    <div class="project-wrapper">
      <div class="project-title">
        <h4>项目概况</h4>
        <el-button class="button-add" type="info" size="small" icon="el-icon-plus" circle @click="handleGoPage"></el-button>
      </div>
      <div class="project-contect">
        <ul>
          <li v-for="(item,index) in projectList" :key="index">
            <span class="li-pname">{{item.pname}}</span>
            <span class="li-waitingtack">待处理任务
              <span style="fontSize:15px;color:#333;letter-spacing:1px;">{{item.waitingtack}}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      projectList: [
        {
          pname: '项目1',
          waitingtack: 10
        },
        {
          pname: '项目2',
          waitingtack: 20
        },
        {
          pname: '项目3',
          waitingtack: 12
        }
      ]
    }
  },
  computed: {},
  methods: {
    handleGoPage() {
      this.$router.push({ name: 'Projectlist' })
    }
  }
}
</script>

<style lang="scss" scoped>
.projectlist-component {
  height: 100%;
  width: 100%;

  .project-wrapper {
    height: 100%;
    width: 100%;
    .project-title {
      height: 50px;
      padding-left: 20px;
      border-radius: 4px;
      position: relative;
      h4 {
        font-size: 22px;
        line-height: 50px;
        color: #36a3f7;
        margin: 0;
      }
      .el-input {
        position: absolute;
        left: 150px;
        top: 6px;
        width: 300px;
      }
      .button-add {
        position: absolute;
        right: 10px;
        top: 6px;
        // color: #44acb6;
      }
    }
    .project-contect {
      width: 100%;
      height: 340px;
      overflow-y: auto;
      ul {
        margin: 0;
        padding: 0 20px 10px 20px;
        li {
          padding: 0 10px 0 20px;
          list-style: none;
          height: 50px;
          display: flex;
          border-bottom: 1px solid #e3e3e3;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          .li-pname {
            font-size: 16px;
            color: #333;
          }
          .li-waitingtack {
            font-size: 12px;
            color: #999;
            display: none;
          }
          &:hover {
            background: #f6f6f6;
          }
          &:hover .li-waitingtack {
            display: block;
          }
        }
      }
    }
  }
}
</style>
