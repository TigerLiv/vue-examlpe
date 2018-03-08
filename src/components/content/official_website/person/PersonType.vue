<template>
  <div class="container">
    <el-row>
      <el-col>
        <el-button class="btn-right" @click="add">添加</el-button>
      </el-col>
      <el-col>
        <el-table :data="tableData" stripe style="width: 100%" align="center">
          <el-table-column prop="name" label="分类"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="edit(scope.row)" class="detail">编辑</el-button>
              <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible" class="dialog">
      <el-form :model="form" label-width="120px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="save" :disabled="forbid">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Interface from '@/util/interface'
  import qs from 'qs'
  export default {
    data() {
      return {
        forbid: false,
        tableData: [],
        form: {
          name: '',
          is_front: '1'
        },
        dialogFormVisible: false,
        id: null,
        status: true,
        tips: ''
      }
    },
    methods: {
      fetch() {
        Interface.getData('get', Interface.about_category.get).then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.data
            this.tableData.forEach(val => {
              if (val.is_front == '1') {
                val.is_front = '是'
              } else {
                val.is_front = '否'
              }
            })
          }
        })
      },
      add() {
        this.dialogFormVisible = true;
        this.status = true;
        this.form.name = null;
        this.tips = ''
      },
      edit(row) {
        console.log(row.is_front)
        this.dialogFormVisible = true;
        this.form.name = row.name;
        if (row.is_front == '是') {
          row.is_front = '1'
        } else {
          row.is_front = '0'
        }
        this.form.is_front = row.is_front;
        this.id = row.id;
        this.status = false;
        this.tips = '修改后，该分类下全部内容经分配给新的分类'
      },
      save() {
        this.forbid = true
        this.dialogFormVisible = false;
        var put = {
          name: this.form.name,
          is_front: this.form.is_front,
          id: this.id,
          _method: 'PUT'
        }
        if (this.status) {
          Interface.getData('post', Interface.about_category.post, this.form).then(res => {
            if (res.data.code == 200) {
              this.forbid = false
              this.$message.success('添加成功！');
              this.fetch()
            } else if (res.data.code == '40005') {
              this.forbid = false
              this.$message.error('该分类已经存在，请重新添加！');
            } else if (res.data.code == 40100) {
              this.forbid = false
              this.$message.error('前台分类数量已够');
            }
          }).catch((res) => {
            this.$message.error('添加失败！');
          })
        } else if (!this.status) {
          Interface.getData('post', Interface.about_category.put + '/' + this.id, put).then(res => {
            if (res.data.code == 200) {
              this.forbid = false
              this.$message.success('修改成功！');
              this.fetch()
            } else if (res.data.code == 40100) {
              this.$message.error('前台分类数量限制4条');
              this.fetch()
            }
          }).catch((res) => {
            this.$message.error('修改失败！');
          })
        }

      },

      destory(row) {
        this.id = row.id
        var params = {
          id: row.id,
          _method: 'DELETE'
        }
        this.$confirm('是否确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Interface.getData('post', Interface.about_category.delete + '/' + row.id, params).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                customClass: '.el-message',
                message: '删除成功!'
              });
              this.fetch()
            } else if (res.data.code == 40006) {
              this.$message({
                type: 'warning',
                customClass: '.el-message',
                message: '该分类有内容，请勿删除！'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          });
        });
      },
    },

    created() {
      this.fetch()
    }
  }

</script>
<style scoped>
  @import '../../../../assets/css/container.css';
  .el-dialog--small {
    width: 30% !important;
  }

  .dialog-input {
    margin: 30px 0;
  }

</style>
