<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!-- 表单
      el-form
        ref 表单对象引用
        model 绑定数据对象
        rules 绑定验证规则对象
      el-form-item
        prop 具体规则属性名称
      el-input 
        v-model 数据对象属性
        prefix-icon 前置图标
      -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!--  -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表单数据
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      // 验证规则
      loginFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
    // console.log(result)
  },
  methods: {
    login() {
      //async 和 await 结合使用
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入正确的用户名和密码')
        }
        try {
          // es6 参数解构
          let { data: result } = await this.$http.post('login', this.loginForm)
          if (result.meta.status !== 200) {
            this.$message.error('登陆失败')
          } else {
            this.$message.success('登陆成功')
            //1, 保存token 到sessionStorage
            window.sessionStorage.setItem('token', result.data.token)
            //2 主页跳转 /home
            this.$router.push('/home')
          }
        } catch (err) {
          return this.$message.error('网络错误，请稍后重试')
        }
      })
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>