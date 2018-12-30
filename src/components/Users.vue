<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/users">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAdd">添加用户</el-button>
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态"
        width="200"
      >
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button @click="showEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
          <el-button @click="delUser(scope.row.id)" type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain round>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>

    <!-- 添加用户的模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="addForm" label-width="80px" :rules="rules" status-icon ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的模态框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form :model="editForm" label-width="80px" :rules="rules" status-icon ref="editForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 3, max: 9, message: '长度应该是3-9位之间'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 12, message: '长度应该是6-12位之间'}
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱', trigger: 'blur'}
        ],
        mobile: [
          {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ]
      },
      editDialogVisible: false,
      editForm: {
        email: '',
        mobile: '',
        id: '',
        username: ''
      }
      // baseURL: 'http://localhost:8888/api/private/v1/'
    }
  },
  created() {
    // 发送ajax请求，获取用户列表数据
    this.getUserList()
  },
  methods: {
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      })
      if (res.data.meta.status === 200) {
        this.userList = res.data.data.users
        this.total = res.data.data.total
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getUserList()
    },
    searchUser() {
      this.currentPage = 1
      this.getUserList()
    },
    async delUser(id) {
      // console.log(id)
      try {
        await this.$confirm('你确定要删除该用户吗？', '温馨提示', {
          type: 'warning'
        })
        let res = await this.axios({
          method: 'delete',
          url: 'users/' + id
          // headers: {
          //   Authorization: localStorage.getItem('token')
          // }
        })
        if (res.data.meta.status === 200) {
          if (this.userList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUserList()
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    async changeState(user) {
      // console.log(user)
      let res = await this.axios({
        method: 'put',
        url: `users/${user.id}/state/${user.mg_state}/`
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      })
      if (res.data.meta.status === 200) {
        this.$message.success('修改成功')
        this.getUserList()
      }
    },
    showAdd() {
      // console.log('hhh')
      this.addDialogVisible = true
    },
    async addUser() {
      try {
        await this.$refs.addForm.validate()
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        })
        if (res.data.meta.status === 201) {
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getUserList()
          this.$message.success('添加成功')
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (e) {
        return false
      }
    },
    showEdit(user) {
      this.editDialogVisible = true
      // this.editForm = user
      this.editForm.id = user.id
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
      this.editForm.username = user.username
    },
    async updateUser() {
      try {
        // 表单校验
        await this.$refs.editForm.validate()
        // 发送ajax请求
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        if (res.data.meta.status === 200) {
          this.$refs.editForm.resetFields()
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('修改用户信息成功')
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  height: 40px;
  line-height: 40px;
}
.input-with-select {
  width: 300px;
  margin-bottom: 5px;
}
</style>
