<template>
  <div class="container">
    <el-row>
      <el-col :span="22">
        <el-select v-model="category_id" placeholder="请选择人员类型" @change="valueChange">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" class="btn-right" @click="add">添加人员</el-button>
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="head_img" label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.head_img" alt="" width="50px">
              </template>
            </el-table-column>
            <el-table-column prop="rank" label="头衔"></el-table-column>
            <el-table-column prop="organization.name" label="公司"></el-table-column>
            <el-table-column prop="name" label="标签">
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.country" type="success" :key="item.id">{{item.name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="intro" label="介绍" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"> </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Interface from '@/util/interface.js'
  export default {
    data() {
      return {
        tableData: [],
        total: 1,
        currentPage: 1,
        categoryOptions: [],
        category_id: ''
      }
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          Interface.getData('get', Interface.website.person.get, {
            category: this.category_id
          }).then(res => {
            if (res.data.code == 200) {
              this.tableData = res.data.data.data
            } else {
              this.tableData = []
            }
          })
        } else if ('category' == scence) {
          Interface.getData('get', Interface.website.person.category).then(res => {
            if (res.data.code == 200) {
              this.categoryOptions = res.data.data
              this.category_id = res.data.data[0].id
            }
          })
        }
      },
      add() {
        this.$router.push('/person/add')
      },
      edit(row) {
        this.$router.push('/person' + '/' + row.id)
      },
      destory(row) {
        this.$confirm('是否确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            _method: 'DELETE',
          }
          Interface.getData('post', Interface.website.person.get + '/' + row.id, param).then(res => {
            if (res.data.code == 200) {
              this.$message.success('删除成功')
              this.fetch('list')
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          this.$message.error('取消删除')
        })
      },
      pageChange(num) {
        this.currentPage = num
      },
      valueChange(params) {
        this.fetch('list')
      }

    },
    created() {
      setTimeout(() => {
        this.fetch('list')
      },200)
      this.fetch('category')
    }
  }

</script>
<style lang="scss">
  @import '../../../../assets/css/container.css';
  .el-tooltip__popper.is-dark {
    width:40%;
  }
</style>
