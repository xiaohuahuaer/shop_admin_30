<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" :status-icon="true">
      <img src="@/assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"  @keyup.enter.native="login"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    async login() {
      try {
        await this.$refs.form.validate()
        let res = await this.axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: this.form
        })
        if (res.data.meta.status === 200) {
          // alert('登录成功')
          this.$message({
            message: '登录成功了',
            type: 'success',
            duration: 1000
          })
          localStorage.setItem('token', res.data.data.token)

          this.$router.push('/home')
        } else {
          // alert('登录失败')
          this.$message({
            message: res.data.meta.msg,
            type: 'error'
          })
        }
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background-color: #2D434C;
  overflow: hidden;
}

.el-form {
  width: 400px;
  background-color: #fff;
  margin: 200px auto;
  padding: 75px 40px 15px;
  border-radius: 20px;
  position: relative;
}

img {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -80px;
  border-radius: 50%;
  border: 10px solid #fff;
}

.el-button ~ .el-button {
  margin-left: 70px;
}
</style>
