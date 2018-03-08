<template>
  <div class="container">
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane label="成功案例" name="0"></el-tab-pane>
          <el-tab-pane label="头条新闻" name="1"></el-tab-pane>
          <el-tab-pane label="移民资讯" name="2"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1" :offset="4">
          <el-button type="primary" class="btn-right" @click="add">添加资讯</el-button>
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="name" label="标题"></el-table-column>
            <el-table-column prop="author" label="作者"></el-table-column>
            <el-table-column prop="cover" label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.cover" alt="" width="50px">
              </template>
            </el-table-column>
            <el-table-column prop="company_name" label="公司"></el-table-column>
            <el-table-column prop="view_count" label="点击量"></el-table-column>
            <el-table-column prop="like_count" label="点赞数"></el-table-column>
            <el-table-column prop="source" label="来源"></el-table-column>
            <el-table-column prop="publish_time" label="发布时间"></el-table-column>
            <el-table-column label="操作" width="150">
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
        activeName:this.$store.state.inforActiveName,
        tableData: [],
        total: 1,
        currentPage: 1,
      }
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          let params = {
            page: this.currentPage,
            pageSize: 10,
            backend: 1,
            type:this.activeName
          }
          Interface.getData('get', Interface.website.case.get, params).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data.data
              this.total = res.data.data.total
              data.forEach(val => {
                val.publish_time = Interface.getTime(val.publish_time)
              })
              this.tableData = data
            } else {
              this.tableData = []
              this.total = 1
            }
          })
        }
      },
      add() {
        this.$router.push('/information/add')
      },
      edit(row) {
        this.$router.push('/information' + '/' + row.id)
      },
      destory(row) {
        console.log(row.id)
        this.$confirm('是否确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            _method: 'DELETE',
          }
          Interface.getData('post', Interface.website.case.delete + '/' + row.id, param).then(res => {
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
        this.fetch('list')
      },
      tabclick(tab) {
        this.$store.state.inforActiveName = tab.name
        this.fetch('list')
      }
    },
    created() {
      
      this.fetch('list')
    }
  }

</script>
<style lang="scss">
  @import '../../../../assets/css/container.css';

</style>
