<template>
  <div class="category">
    <el-button type="success" plain>添加分类</el-button>
    <el-table
      :data="categoryList"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
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
      loading: true
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
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>

</style>
