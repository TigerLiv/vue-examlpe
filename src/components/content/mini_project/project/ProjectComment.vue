<template>
  <div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col>
        <!-- <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane label="已上架" name="1"></el-tab-pane>
          <el-tab-pane label="已下架" name="2"></el-tab-pane>
        </el-tabs> -->
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="50"></el-table-column> -->
            <el-table-column prop="project_title" label="评论项目"></el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column prop="grade" label="评分等级"></el-table-column>
            <el-table-column prop="user_name" label="评论者"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit('top',scope.row)">{{tableData[scope.$index].status == 1?'下架':'上架'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange" :current-page="currentPage"> </el-pagination>
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
        activeName: '',
        tableData: [],
        total: 1,
        currentPage: 1,
        loading: true,
        ids: ''
      }
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          let params = {
            project_id: this.$route.params.id,
            page: this.currentPage,
            pageSize: 10,
          }
          Interface.getData('get', Interface.project.pcomment, params).then(res => {
            if (res.data.code == 200) {
              this.loading = false
              this.tableData = res.data.data.data
              this.total = res.data.data.total
            } else {
              this.tableData = []
              this.total = 1
            }
          })
        }
      },
      edit(scence, row) {
        if ('top' == scence) {  //上下架
          let params = {
            ids: `[${row.id}]`,
          }
          if (row.status) {
            params.status = 0
          } else {
            params.status = 1
          }
          Interface.getData('post', Interface.project.pcomment_status, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功！')
              this.fetch('list')
            }
          })
        }

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
          Interface.getData('post', `${Interface.project.delete}/${row.id}`, param).then(res => {
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
      handleSelectionChange(value) {
        let tops = ''
        value.forEach((val, index) => {
          tops += val.id
          if (index < value.length - 1) {
            tops += ','
          }
        })
        this.ids = tops
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
  .createProject {
    float: right;
    margin-right: 30px;
  }

  .country_intro {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .handle-status {
    margin-bottom: 20px;
  }

</style>
