<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条 -->
      <el-input v-model.trim="listQuery.paramObj.projectName" placeholder="项目名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建新项目
      </el-button>
    </div>
    <!-- table -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="项目名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="项目成员" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userList | pNames }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员数量" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userList |pNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteProject(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
    <!-- modal -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 600px; margin-left:0px;">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="temp.projectName" style="width:350px" />
        </el-form-item>
        <el-form-item label="项目周期" prop="pTime">
          <el-date-picker v-model="temp.pTime" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:350px" />
        </el-form-item>
        <el-form-item label="项目成员" prop="projecMember">
          <el-select v-model="temp.projecMember" value-key="userId" label="项目成员" filterable multiple placeholder="请选择项目成员" style="display:block">
            <el-option v-for="item in options" :key="item.userId" :label="item.userName" :value="item" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addProject():updateProject()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addProject, updateProject, deleteProject } from '@/api/setting-project'
import { getAllList as getAllUserList } from '@/api/setting-user'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import router from '@/router'

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {},
  filters: {
    pNames(value) {
      if (!value) return ''
      const arr = []
      value.forEach(item => {
        arr.push(item.userName)
      })
      return arr.join(',')
    },
    pNum(value) {
      if (!value) return ''
      return value.length
    }
  },
  data() {
    return {
      tableKey: 1,
      list: [],
      total: 0,
      listLoading: true,
      // 查询参数
      listQuery: {
        current: 1,
        size: 20,
        paramObj: {
          projectName: ''
        }
      },
      options: [], // 用户列表
      // 新增参数
      temp: {
        projectName: '',
        pTime: [],
        projecMember: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑项目',
        create: '添加项目'
      },
      rules: {
        projectName: [{ required: true, message: '项目名称不能为空', trigger: 'change' }],
        pTime: [{ required: true, message: '项目周期不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getAllUserList()
  },
  methods: {
    // 查询
    getList() {
      this.listLoading = true
      if (!this.listQuery.paramObj.projectName) {
        this.listQuery.paramObj.projectName = undefined
      }
      getList(this.listQuery)
        .then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
        .catch(() => {})
    },
    // 查询用户列表
    getAllUserList() {
      this.listLoading = true
      getAllUserList({}).then(response => {
        this.options = response.data
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置参数
    resetTemp() {
      this.temp = {
        projectName: '',
        pTime: [],
        projecMember: []
      }
    },
    // 添加打开模态框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增项目
    addProject() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addProject({
            projectName: this.temp.projectName,
            startDate: this.temp.pTime[0],
            endDate: this.temp.pTime[1],
            userList: this.temp.projecMember
          }).then(() => {
            this.dialogFormVisible = false
            this.getList()
            // 在这里获取异步路由
            this.changeRoute()
            this.$notify({
              title: 'Success',
              message: '项目新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑打开模态框
    handleUpdate(row) {
      this.temp = Object.assign({
        projectId: row.projectId,
        projectName: row.projectName,
        pTime: [row.startDate, row.endDate],
        projecMember: row.userList
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新项目
    updateProject() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateProject({
            projectName: this.temp.projectName,
            startDate: this.temp.pTime[0],
            endDate: this.temp.pTime[1],
            projectId: this.temp.projectId,
            userList: this.temp.projecMember
          }).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.changeRoute()
            this.$notify({
              title: 'Success',
              message: '项目修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除项目
    deleteProject(row) {
      this.$confirm('确定要删除该项目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          deleteProject(row.projectId).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.changeRoute()
            this.$notify({
              title: 'Success',
              message: '项目删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 更新路由
    changeRoute() {
      const roles = ['admin']
      this.$store.dispatch('permission/generateRoutes', roles).then(accessRoutes => {
        router.addRoutes(accessRoutes)
      })
      this.$store.dispatch('tagsView/delAllViews', null, { root: true })
    }
  }
}
</script>
