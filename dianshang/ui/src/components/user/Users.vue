<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片-->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table stripe :data="userlist" border style="width: 100%">
        <el-table-column prop="id" label="id" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="roleName" label="角色" width="180"></el-table-column>
        <el-table-column prop="mobile" label="联系方式"></el-table-column>
      </el-table>

      <!-- 分页 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      //参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    search() {
      console.log(this.keyword)
    },
    async getUserList() {
      const { data: result } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('用户查询失败')
      }
      this.userlist = result.data.users
      this.total = result.data.total
    }
  }
}
</script>
<style lang="less" scoped>
.el-table{
  margin-top: 30px;
}
</style>