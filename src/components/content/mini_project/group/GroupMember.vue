<template>
  <div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col :span="1" :offset="21">
        <el-button @click="edit('out')">导出表格</el-button>
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="user_nickname" label="微信昵称"></el-table-column>
            <el-table-column prop="user_age" label="年龄"></el-table-column>
            <el-table-column prop="user_education" label="学历"></el-table-column>
            <el-table-column prop="user_tel" label="手机号"></el-table-column>
            <el-table-column prop="group_title" label="群名称"></el-table-column>
            <el-table-column prop="source_title" label="来源"></el-table-column>
            <el-table-column prop="code" label="邀请码"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit('allow',scope.row)">{{tableData[scope.$index].join_flag == 0?'允许加群':'退群'}}</el-button>
                <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col style="margin:15px 0;">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"> </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import Interface from '@/util/interface'
  export default {
    data() {
      return {
        total: 0,
        currentPage: 1,
        tableData: [],
        loading: true
      }
    },
    methods: {
      fetch(scence) {
        let params = {
          group_id: this.$route.params.id,
          page: this.currentPage,
          pageSize: 10,
        }
        if ('list' == scence) {
          Interface.getData('get', Interface.wx_group.user, params).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data.data
              data.forEach(element => {
                element.created_at = Interface.getTime(element.created_at)
              })
              this.tableData = data;
              this.total = res.data.data.total
              this.loading = false
            } else if (res.data.code == 40001) {
              this.tableData = []
              this.loading = false
            }
          })
        }
      },
      edit(scence, row) {
        if ('allow' == scence) {
          let params = {
            id: row.id,
          }
          if (row.join_flag == 1) {
            params.join_flag = 0
          } else {
            params.join_flag = 1
          }
          Interface.getData('post', Interface.wx_group.join, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功')
              this.fetch('list')
            } else {
              this.$message.error('失败')
            }
          })
        } else if ('out' == scence) {
          let host = ''
          if (location.hostname == 'localhost') {
            host = 'https://tpy-api.qeebu.com/group/user/export?'
          } else {
            host = '/api/group/user/export?'
          }
          window.open(host + 'group_id=' + this.$route.params.id)
        }
      },

      destory(row) {
        var params = {
          _method: 'DELETE'
        }
        this.$confirm('是否确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Interface.getData('post', Interface.wx_group.delete_user + '/' + row.id, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('删除成功!');
              //删除成功之后页面刷新
              this.fetch('list')
            } else if (res.data.code == 40001) {
              this.$message.warning('不能删除!');
            }
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          });
        });
      },
      pageChange(num) {
        this.currentPage = num;
        this.fetch('list')
      },
    },
    created() {
      this.fetch('list')
    }
  }

</script>
<style scoped lang="scss">
  @import '../../../../assets/css/container.css';
  .detail {
    border: none;
    background: transparent;
    &:hover {
      background: transparent;
      color: #333;
    }
  }

  .el-upload-list {
    width: 25% !important;
  }

  .avator {
    margin-top: 6px;
    width: 50px;
    height: 50px;
  }

  .el-upload-list--picture-card {
    position: absolute;
    left: -100px;
  }

  .modelBtn {
    margin-bottom: 5px;
  }

  .el-form-item {
    margin-bottom: 50px;
  }
</style>