<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条 -->
      <el-input v-model.trim="listQuery.paramObj.userName" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-select v-model.trim="listQuery.paramObj.deptName" placeholder="部门" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in teamOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <!-- table -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deptName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="登录名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteUser(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
    <!-- modal -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 500px; margin-left:0px;">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="temp.loginName" />
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input v-model="temp.passwd" />
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-select v-model="temp.deptName" class="filter-item" placeholder="部门名称" style="width:100%">
            <el-option v-for="item in teamOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addUser():updateUser()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addUser, updateUser, deleteUser } from '@/api/setting-user'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const teamOptions = [
  { key: '一体化产品研发部', display_name: '一体化产品研发部' },
  { key: '信息化产品研发部', display_name: '信息化产品研发部' },
  { key: '影像产品研发部', display_name: '影像产品研发部' },
  { key: '平台产品研发部', display_name: '平台产品研发部' },
  { key: '产品管理部', display_name: '产品管理部' },
  { key: '产品测试部', display_name: '产品测试部' },
  { key: '质量部', display_name: '质量部' }
]

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        paramObj: {
          userName: '',
          deptName: ''
        },
        size: 20
      },
      teamOptions,
      // 新增参数
      temp: {
        userName: '',
        loginName: '',
        passwd: '',
        deptName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      rules: {
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'change' }],
        userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        loginName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        passwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询
    getList() {
      this.listLoading = true
      if (!this.listQuery.paramObj.userName) {
        this.listQuery.paramObj.userName = undefined
      }
      if (!this.listQuery.paramObj.deptName) {
        this.listQuery.paramObj.deptName = undefined
      }

      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 重置参数
    resetTemp() {
      this.temp = {
        userName: '',
        loginName: '',
        passwd: '',
        deptName: ''
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
    // 新增用户
    addUser() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '用户新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑打开模态框
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新用户
    updateUser() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '用户修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除用户
    deleteUser(row) {
      deleteUser(row.userId).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: 'Success',
          message: '用户删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
