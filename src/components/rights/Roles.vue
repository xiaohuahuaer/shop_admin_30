<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/roles">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAdd">添加角色</el-button>
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-show="row.children.length === 0">暂无权限</span>
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRight(row, l1.id)" closable>{{l1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRight(row, l2.id)" closable type="success">{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="delRight(row, l3.id)" closable class="l3" type="danger" v-for="l3 in l2.children" :key="l3.id">{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button @click="showEdit(row)" type="primary" plain icon="el-icon-edit" circle size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" circle size="mini" @click="delRole(row.id)"></el-button>
          <el-button type="success" plain icon="el-icon-check" round size="mini" @click="showAssign(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="40%">
      <el-tree node-key="id" ref="tree" :data="rightList" :props="defaultProps" show-checkbox default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="addForm.id ? '修改角色' : '添加角色'" :visible.sync="addDialogVisible" width="40%">
      <el-form status-icon ref="addForm" :rules="rules" :model="addForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      assignDialogVisible: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addDialogVisible: false,
      addForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '角色描述不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data
      }
    },
    async delRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.data.meta.status === 200) {
        // this.getRoleList()
        role.children = res.data.data
        this.$message.success('删除权限成功了')
      }
    },
    async showAssign(role) {
      this.roleId = role.id
      this.assignDialogVisible = true
      let res = await this.axios.get('rights/tree')
      if (res.data.meta.status === 200) {
        this.rightList = res.data.data
        let ids = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      }
    },
    async assignRight() {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkedKeys.concat(halfCheckedKeys).join()
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {rids})
      if (res.data.meta.status === 200) {
        this.assignDialogVisible = false
        this.getRoleList()
        this.$message.success('分配权限成功')
      }
    },
    async delRole(id) {
      try {
        await this.$confirm('你确定要删除该角色吗', '温馨提示', {type: 'warning'})
        let res = await this.axios.delete(`roles/${id}`)
        if (res.data.meta.status === 200) {
          this.getRoleList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    showAdd() {
      this.addDialogVisible = true
      this.addForm.id = ''
      this.addForm.roleName = ''
      this.addForm.roleDesc = ''
    },
    showEdit(role) {
      this.addDialogVisible = true
      this.addForm.id = role.id
      this.addForm.roleName = role.roleName
      this.addForm.roleDesc = role.roleDesc
    },
    async addRole() {
      try {
        await this.$refs.addForm.validate()
        let id = this.addForm.id
        let method = this.addForm.id ? 'put' : 'post'
        let url = id ? `roles/${id}` : 'roles'
        let status = id ? 200 : 201
        let res = await this.axios[method](url, this.addForm)
        if (res.data.meta.status === status) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getRoleList()
          this.$message.success('操作成功了')
        }
      } catch (e) {
        return false
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style scoped>
.l1 {
  padding: 5px 0;
}
.l2 {
  margin-bottom: 5px;
}
.l3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
