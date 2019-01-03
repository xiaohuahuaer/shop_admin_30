<template>
  <div class="category">
    <el-button type="success" plain @click="showAdd">添加分类</el-button>
    <el-table
      :data="categoryList"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="30">
      </el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="{row}">
          {{row.cat_deleted ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" circle plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" circle plain icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form :rules="rules" status-icon ref="addForm" :model="addForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            change-on-selector
            :options="options"
            v-model="addForm.cat_pid"
            :props="props">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      options: [],
      props: {
        children: 'children',
        value: 'cat_id',
        label: 'cat_name'
      },
      rules: {
        cat_name: [
          {required: true, message: '分类名不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      if (res.data.meta.status === 200) {
        this.categoryList = res.data.data.result
        this.total = res.data.data.total
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    async showAdd() {
      this.addDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      if (res.data.meta.status === 200) {
        this.options = res.data.data
      }
    },
    async addCategory() {
      try {
        await this.$refs.addForm.validate()
        let {cat_name: catName, cat_pid: catPid} = this.addForm
        let res = await this.axios.post('categories', {
          cat_name: catName,
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_level: catPid.length
        })
        if (res.data.meta.status === 201) {
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          this.getCategoryList()
          this.$message.success('添加成功')
        }
      } catch (e) {
        return false
      }
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>

</style>
