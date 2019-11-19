<template>
  <el-container class="home-container">
    <el-header>
      <!-- logo -->
      <div @click="backHome" class="logo">
        <img src="../assets/logo.png" />
        <span>{{title}}</span>
      </div>
      <div>
        <i class="el-icon-user-solid" />
        <span>{{username}}</span>
        <el-button type="info" @click="logout" size="medium" round>注销</el-button>
      </div>
      <!-- logout -->
    </el-header>
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="menuCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">{{menuCollapseTitle}}</div>
        <el-menu
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="menuCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id+ ''" v-for="(menu,idx) in menulist" :key="idx">
            <!-- 一级菜单  模板-->
            <template slot="title">
              <!-- 一级菜单  图标-->
              <i :class="iconMap[menu.id]"></i>
              <!-- 一级菜单  文字-->
              <span>{{menu.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subMenu.path"
              v-for="(subMenu,subIdx) in menu.children"
              :key="subIdx"
              @click="saveNavState('/'+subMenu.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subMenu.authName}}</span>
              </template>
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
  data() {
    return {
      title: '后台管理系统',
      menulist: [],
      iconMap: {
        '125': 'el-icon-user-solid',
        '126': 'el-icon-s-tools',
        '127': 'el-icon-shopping-bag-1',
        '128': 'el-icon-shopping-cart-full',
        '129': 'el-icon-data-line'
      },
      menuCollapse: false,
      menuCollapseTitle: '<',
      username: '',
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('nav')
    // this.$router.
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      let { data: result } = await this.$http.post('menus')
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.menulist = result.data
    },
    toggleCollapse() {
      this.menuCollapse = !this.menuCollapse
      this.menuCollapseTitle = this.menuCollapse ? '>' : '<'
    },
    backHome() {
      this.$router.push('/home')
    },
    saveNavState(path) {
      // console.log(path)
      this.activePath = path
      window.sessionStorage.setItem('nav', path)
    }
  }
}
</script>
<style scoped lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-content: center;
  color: #fff;
  font-size: 20px;
  .logo {
    cursor: pointer;
  }
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      height: 40px;
      width: 40px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 24px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  // letter-spacing: 0.2em;
  cursor: pointer;
  user-select: none;
}
</style>