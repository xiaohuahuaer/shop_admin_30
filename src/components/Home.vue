<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <span>欢迎光临</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    async logout() {
      try {
        await this.$confirm('您确定要退出本系统吗？', '温馨提示', {
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message.success('退出系统成功')
      } catch (e) {
        this.$message.info('取消删除')
      }
    }
  }
}
</script>

<style scoped>
.home {
  height: 100%;
}

.el-header {
  background-color: #B3C1CD;
  display: flex;
}

.el-header .logo {
  width: 180px;
  background-image: url('~@/assets/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.el-header .logout {
  width: 180px;
  font-weight: 700;
  text-align: right;
  line-height: 60px;
}

.el-header .logout a {
  color: darkorange;
}

.el-header .title {
  flex: 1;
}

.el-header .title h1 {
  text-align: center;
  line-height: 60px;
  color: #fff;
  font-size: 30px;
}

.el-aside {
  background-color: #545C64;
}

.el-aside .el-submenu {
  width: 200px;
}

.el-main {
  background-color: #D4DFE4;
}
</style>
