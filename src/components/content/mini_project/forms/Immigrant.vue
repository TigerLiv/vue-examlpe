<template>
  <div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName">
          <el-tab-pane label="移民评估表单" name="first">
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1" :offset="4">
          <el-button class="btn-right" @click="add" v-show="activeName == 'first'">创建表单</el-button>
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column prop="title" label="表单名称"> </el-table-column>
            <el-table-column prop="required_num" label="必做题数量" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="choose_num" label="选做题数量" show-overflow-tooltip> </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
                <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="newsUp(scope.row)">{{tableData[scope.$index].status == 1?'下架':'上架'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div>
          <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"> </el-pagination>
        </div> -->
      </el-col>
      <el-col>
          <el-dialog title="" :visible.sync="dialogVisible">
              <el-form :model="form" label-width="80px">
                  <el-form-item label="表单名称">
                      <el-input v-model="form.title" auto-complete="off" ></el-input>
                  </el-form-item>
                  <el-form-item class="modelBtn">
                      <el-button @click="dialogVisible = false">取 消</el-button>
                       <el-button type="primary" @click="save">确 定</el-button>
                  </el-form-item>
              </el-form>
          </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Interface from '@/util/interface'
  import qs from 'qs'
  export default {
    data() {
      return {
        activeName: 'first',
        total: 0,
        currentPage: 1,
        tableData: [],
        multipleSelection: [],
        id: '',
        videoId: '',
        loading:true,
        dialogVisible:false,
        form:{}
      }
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          Interface.getData('get', Interface.form.get).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data
              console.log(data)
              this.total = res.data.total
              this.tableData = data
              this.loading = false
              data.forEach((val) => {
                val.created_at = Interface.getTime(val.created_at)
              })
            } else if (res.data.code == 40001) {
              this.tableData = []
            }
          })
        }

      },
      newsUp(row) {
        var params = {
          id: row.id,
          _method:'PUT',
          status:row.status?0:1
        }
        // if()
        Interface.getData('post', Interface.form.put + '/' + row.id, params).then(res => {
          if (res.data.code == 200) {
            this.$message.success('修改状态成功！')
            this.fetch('list')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      add() {
        this.dialogVisible = true;
      },
      edit(row) {
        this.$router.push({ path: '/add-immigrant/' + row.id })
      },
      save() {
        Interface.getData('post',Interface.form.post,this.form).then(res => {
          if(res.data.code == 200) {
            this.dialogVisible = false;
            this.$message.success('创建成功')
            this.fetch('list')
          }
        })
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
          Interface.getData('post', Interface.form.delete + '/' + row.id, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('删除成功!');
              //删除成功之后页面刷新
              this.fetch('list')
            } else if (res.data.code == 40001) {
              this.$message.warning('该表单不能删除!');
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
    },
  }

</script>
<style scoped>
  .detail {
    border: none;
    background: transparent;
  }

  .detail:hover {
    background: transparent;
    color: #333;
  }

</style>
