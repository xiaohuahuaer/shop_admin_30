<template>
  <div class="goods-add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="change">
      <el-tab-pane name="basic" label="基本信息">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :options="options" v-model="form.goods_cat" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="form.is_promote" :label="true">是</el-radio>
            <el-radio v-model="form.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(1 ,'pic')">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="handleSuccess"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="content" label="商品内容">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        is_promote: false,
        pics: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    change(tab, index) {
      this.active = +tab.index
    },
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    handleSuccess(res, file, fileList) {
      // console.log('res', res)
      // console.log('file', file)
      // console.log('fileList', fileList)
      if (res.data.meta.status === 200) {
        this.form.pics.push({
          pic: res.data.data.tmp_path
        })
      }
    },
    async addGood() {
      // this.form.goods_cat = this.form.goods_cats.join()
      let res = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      if (res.data.meta.status === 201) {
        this.$message.success('添加成功')
        this.$router.push('/goods')
      }
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    if (res.data.meta.status === 200) {
      this.options = res.data.data
    }
  }
}
</script>

<style scoped>
.quill-editor {
  background-color: #fff;
}

.quill-editor .ql-editor {
  height: 200px;
}
</style>
