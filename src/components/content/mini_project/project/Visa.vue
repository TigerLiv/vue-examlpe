<template>
    <div class="container">
      <el-row>
        <el-col :span="1" :offset="21">
          <el-button @click="add">添加签证</el-button>
        </el-col>
        <el-col>
        </el-col>
        <el-col>
          <div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
              <el-table-column prop="title" label="名称"></el-table-column>
              <!-- <el-table-column prop="link" label="链接"></el-table-column> -->
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col>
          <el-dialog title="" :visible.sync="dialogVisible">
            <el-form :model="form" label-width="80px" :rules="rules">
              <el-form-item label="签证名称" prop="title">
                <el-input v-model="form.title" auto-complete="off"></el-input>
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
    import ImageUpload from '@/components/common_components/ImageUpload.vue';
    export default {
      data() {
        return {
          activeName: '0',
          total: 0,
          currentPage: 1,
          categoryOptions: [],
          category_id: '',
          tableData: [],
          id: '',
          editId: '',
          forbid: false,
          dialogVisible: false,
          form: {},
          rules: {
            name: [{
              required: true,
              message: '请输入友情链接名称',
              trigger: 'blur'
            }],
          },
          status: true,
        }
      },
      components: {
        'imageUpload': ImageUpload
      },
      methods: {
        fetch(scence) {
          let params = {
            page: this.currentPage,
            pageSize: 10,
          }
          if ('list' == scence) {
            Interface.getData('get', Interface.website.visa.get, params).then((res) => {
              if (res.data.code == 200) {
                let data = res.data.data
                this.tableData = data;
              } else if (res.data.code == 40001) {
                this.tableData = []
              }
            })
          }
  
        },
        add() {
          this.dialogVisible = true;
          this.status = true
          this.form.title = ''
        },
        edit(row) {
          this.dialogVisible = true
          this.status = false
          this.editId = row.id
          this.form.title = row.title
        },
        save() {
          if (this.status) { //添加
            Interface.getData('post', Interface.website.visa.post, {title:this.form.title}).then(res => {
              if (res.data.code == 200) {
                this.dialogVisible = false
                this.$message.success('添加成功！')
                this.fetch('list')
              }
            })
          } else { //修改
            let params = {}
            params.title = this.form.title
            params._method = 'PUT'
            Interface.getData('post', `${Interface.website.visa.post}/${this.editId}`, params).then(res => {
              if (res.data.code == 200) {
                this.dialogVisible = false
                this.$message.success('修改成功！')
                this.status = true
                this.fetch('list')
              }
            })
          }
        },
        destory(row) {
          var params = {
            id:row.id,
            _method: 'DELETE'
          }
          this.$confirm('是否确定要删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Interface.getData('post', Interface.website.visa.delete + '/' + row.id, params).then(res => {
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
        getFile(url) {
          this.imageUrl = url
        },
        tabclick(tab) {
          this.fetch('list')
        }
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
  
  </style>
  