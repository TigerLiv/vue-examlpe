<template>
  <div class="container">
    <el-row>
      <el-col>
        <div>
          <el-button type="primary" class="btn-right" @click="add">添加页面</el-button>
        </div>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="picture" label="图片"></el-table-column>
            <el-table-column prop="company" label="地区"></el-table-column>
            <el-table-column prop="category" label="类型"></el-table-column>
            <el-table-column prop="country" label="国家"></el-table-column>
            <el-table-column prop="tags" label="标签"></el-table-column>
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
          Interface.getData('get', Interface.page.get).then(res => {
            if (res.data.code == 200) {
              this.tableData = res.data.data.data
            } else {

            }
          })
        }
      },
      add() {
        this.$router.push('/page/add')
      },
      edit(row) {
        this.$router.push('/page' + '/' + row.id)
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
          Interface.getData('post', Interface.page.delete + '/' + row.id, param).then(res => {
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

    },
    created() {
      this.fetch('list')
    }
  }

</script>
<style lang="scss">
  @import '../../../../assets/css/container.css';

</style>
