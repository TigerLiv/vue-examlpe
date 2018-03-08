<template>
  <div class="container">
    <el-row>
      <el-col>
        <div>
          <el-button type="primary" class="btn-right" @click="add">添加活动</el-button>
        </div>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="name" label="标题"></el-table-column>
            <el-table-column prop="cover" label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.cover" alt="" width="50px">
              </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="company_name" label="公司"></el-table-column>
            <el-table-column prop="start_time" label="开始时间"></el-table-column>
            <el-table-column prop="end_time" label="结束时间"></el-table-column>
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
      }
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          let params = {
            page:this.currentPage,
            pageSize:10,
            backend:1
          }
          Interface.getData('get', Interface.website.activity.get,params).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data.data
              this.total = res.data.data.total
              data.forEach(val => {
                val.start_time = Interface.getTime(val.start_time)
                val.end_time = Interface.getTime(val.end_time)
              })
              this.tableData = data
            } else {

            }
          })
        }
      },
      add() {
        this.$router.push('/activity/add')
      },
      edit(row) {
        this.$router.push('/activity' + '/' + row.id)
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
          Interface.getData('post', Interface.website.activity.delete + '/' + row.id, param).then(res => {
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

    },
    created() {
      this.fetch('list')
    }
  }

</script>
<style lang="scss">
  @import '../../../../assets/css/container.css';

</style>
