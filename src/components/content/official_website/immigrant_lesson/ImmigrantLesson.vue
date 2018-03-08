<template>
  <div class="container">
    <el-row>
      <el-col>
        <div>
          <el-button type="primary" class="btn-right" @click="add">添加课堂</el-button>
        </div>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="name" label="视频标题"></el-table-column>
            <el-table-column prop="cover" label="视频封面">
              <template slot-scope="scope">
                <img :src="scope.row.cover" alt="" width="50px">
              </template>
            </el-table-column>
            <el-table-column prop="speaker_name" label="主讲人"></el-table-column>
            <el-table-column prop="description" label="视频介绍">
              <template slot-scope="scope">
                <span class="description">{{scope.row.description}}</span>
              </template>
            </el-table-column>
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
        routeName:'',
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
          Interface.getData('get', Interface.website.lesson.get_lesson,params).then(res => {
            if (res.data.code == 200) {
              this.total = res.data.data.total
              this.tableData = res.data.data.data
            } else {
              this.tableData = []
            }
          })
        }
      },
      add() {
        this.$router.push('/lesson/add')
      },
      edit(row) {
        this.$router.push(`/lesson/${row.id}`)
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
          Interface.getData('post', Interface.website.lesson.delete_lesson + '/' + row.id, param).then(res => {
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
    },
  }

</script>
<style lang="scss">
  @import '../../../../assets/css/container.css';
  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
