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
          <el-input
            clearable
            @clear="getUserList"
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList "></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisable=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table stripe :data="userlist" border style="width: 100%">
        <el-table-column label="#" type="index" width="180"></el-table-column>
        <el-table-column prop="id" label="id" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="联系方式"></el-table-column>
        <el-table-column prop="roleName" label="角色" width="180"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.msgState" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateUserDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row)"
            ></el-button>
            <el-tooltip content="配置角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total ,sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog
      @close="addUserDialogClose"
      width="50%"
      title="添加用户"
      :visible.sync="addUserDialogVisable"
    >
      <el-form
        ref="addUserFormRef"
        :model="addUserForm"
        :rules="addUserFormRules"
        label-width="70px"
      >
        <!--  -->
        <el-form-item prop="username" label="名 字">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密  码">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮  箱">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手  机">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="addUserDialogVisable=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      @close="updateUserDialogClose"
      width="50%"
      title="修改用户"
      :visible.sync="updateUserDialogVisable"
    >
      <el-form
        ref="updateUserFormRef"
        :model="addUserForm"
        :rules="addUserFormRules"
        label-width="70px"
      >
        <!--  -->
        <el-form-item prop="username" label="名 字">
          <el-input v-model="addUserForm.username" readonly></el-input>
        </el-form-item>
        <!-- <el-form-item prop="password" label="密  码">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>-->
        <el-form-item prop="email" label="邮  箱">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手  机">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="updateUserDialogVisable=false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var emailRule = (rule, value, callback) => {
      const regEmail = /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (!regEmail.test(value)) {
        callback(new Error('邮箱格式不正确'))
      }
      return callback()
    }
    var phoneRule = (rule, value, callback) => {
      const regPhone = /1[3-9][0-9]{9}/
      if (!regPhone.test(value)) {
        callback(new Error('手机格式不正确'))
      }
      return callback()
    }
    return {
      keyword: '',
      //参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      userlist: [],
      total: 0,
      addUserDialogVisable: false,
      updateUserDialogVisable: false,
      addUserForm: {
        username: '',
        password: '',
        email: 'wpp@qq.com',
        mobile: '13866668888'
      },

      // 验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        email: [{ validator: emailRule, trigger: 'blur' }],
        mobile: [{ validator: phoneRule, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    search() {
      // console.log(this.keyword)
    },
    async getUserList() {
      const { data: result } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$message.error('用户查询失败')
      }
      this.userlist = result.data.users
      this.total = result.data.total
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getUserList()
    },
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.getUserList()
    },
    async changeState(row) {
      let { data: result } = await this.$http.put(
        `/users/${row.id}/state/${row.msgState}`
      )
      if (result.meta && result.meta.status !== 200) {
        return this.$message.error(`${row.id}更新失败`)
      } else {
        row.msgState = !row.msgState
        return this.$message.success(`${row.id}更新成功`)
      }
    },
    addUserDialogClose() {
      // console.log()
      this.$refs.addUserFormRef.resetFields()
    },
    updateUserDialogClose() {},
    addUser() {
      this.$refs.addUserFormRef.validate(async vaild => {
        if (vaild) {
          let { data: res } = await this.$http.post(
            '/addUser',
            this.addUserForm
          )
          if (res.meta.status !== 200) {
            this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            this.addUserDialogVisable = false
            this.getUserList()
          }
        }
      })
    },
    updateUserDialog(row) {
      console.log('update', row)
      this.updateUserDialogVisable = true
      this.addUserForm.username = row.username
      this.addUserForm.email = row.email
      this.addUserForm.mobile = row.mobile
    },
    updateUser() {
      this.$refs.updateUserFormRef.validate(async vaild => {
        if (vaild) {
          let { data: res } = await this.$http.post(
            '/addUser',
            this.addUserForm
          )
          if (res.meta.status !== 200) {
            this.$message.error('更新用户失败')
          } else {
            this.$message.success('更新用户成功')
            this.updateUserDialogVisable = false
            this.getUserList()
          }
        }
      })
    },
    async deleteUser(row) {
      if (row && row.id) {
        console.log(row)
        try {
          let { data: res } = await this.$http.delete('/deleteUser/' + row.id)
          if (!res) {
            this.$message.error('网络出现问题，请稍后重试')
          } else if (res.meta.status !== 200) {
            this.$message.error('删除用户失败')
          } else {
            this.$message.success('删除用户成功')
            this.getUserList()
          }
        } catch (err) {
          this.$message.error('网络出现问题，请稍后重试：' + err)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 30px;
}
</style>