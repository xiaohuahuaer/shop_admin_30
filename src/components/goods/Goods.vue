<template>
  <div class="goods">
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodList">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">{{row.add_time | dateFilter}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" plain size="mini" circle icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" circle icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      query: ''
    }
  },
  methods: {
    async getGoodList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      if (res.data.meta.status === 200) {
        this.total = res.data.data.total
        this.goodList = res.data.data.goods
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodList()
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style>

</style>
