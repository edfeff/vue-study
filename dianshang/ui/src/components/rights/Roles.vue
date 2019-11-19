<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table stripe :data="roleList" border style="width: 100%">
        <!-- 展开列 -->
        <el-table-column label type="expand">
          <!--权限列表  -->
          <template slot-scope="scope">
            <el-row
              :class="['vcenter','bdbottom',i1===0?'bdtop':'',]"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2 ,i2) in item1.children"
                  :class="['vcenter',i2===0?'':'bdtop']"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="index" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="danger" icon="el-icon-edit" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      try {
        let { data: res } = await this.$http.get('/roles')
        if (res.meta.status != 200) {
          return this.$message.error('获取数据错误')
        }
        this.roleList = res.data
      } catch (err) {
        return this.$message.error('网络错误，无法获取数据')
      }
    },
    async removeRightById(role, rightId) {
      let result = await this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result === 'confirm') {
        let { data: res } = await this.$http.delete(
          `/roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          this.$message.error('删除失败咯')
        } else {
          //返回所有角色信息时
          role = res.data
          // 返回单个角色信息时
          // role.children = res.data
          this.$message.success('删除成功')
        }
        // this.$message.success('删除成功')
      } else {
        this.$message.info('取消操作')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 25px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>