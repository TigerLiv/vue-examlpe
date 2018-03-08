<template>
  <div class="container">
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane label="署名列表" name="0"></el-tab-pane>
          <el-tab-pane label="分享列表" name="1"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1" :offset="4">
        <el-button @click="add">添加</el-button>
      </el-col>
      <el-col>
        <!-- <el-date-picker v-model="startTime" align="right" type="datetime" placeholder="选择日期" @change="timeChange('start',$event)">
                </el-date-picker>
                <el-date-picker v-model="endTime" align="left" type="datetime" placeholder="选择日期" @change="timeChange('end',$event)">
                </el-date-picker> -->

      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column v-if="activeName == 1" prop="mark" label="图片名称"></el-table-column>
            <el-table-column prop="value" :label="activeName == 1 ? '图片' : '署名'">
              <template slot-scope="sco">
                <img :src="sco.row.value" alt="" v-if="activeName == 1" height="80px">
                <span v-else>{{sco.row.value}}</span>
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
      </el-col>
      <el-col>
        <el-dialog title="" :visible.sync="dialogVisible">
          <el-form :model="form" label-width="80px">
            <el-form-item label="署名" v-if="activeName == 0">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片名称" v-if="activeName == 1">
              <el-input v-model="form.mark" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片" v-if="activeName == 1">
              <image-upload @getUrl="getFile" ref="upload" class="createProject-upload"></image-upload>
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
        imageUrl: '',
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
          type: this.activeName
        }
        if ('list' == scence) {
          Interface.getData('get', Interface.share.get, params).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data.data
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
        this.form.name = ''
        this.form.mark = ''
        if (this.activeName == 1) {
          setTimeout(() => {
            this.$refs.upload.imageFile = []
          }, 10)
        }
      },
      edit(row) {
        this.dialogVisible = true
        this.status = false
        this.editId = row.id
        if (this.activeName == 0) {
          this.form.name = row.value
        } else {
          this.form.mark = row.mark
          this.$refs.upload.imageFile = [{
            url: row.value
          }]
        }
      },
      save() {
        // console.log(this)
        let params = {}
        if (this.status) { //添加
          if (this.activeName == 0) {
            params = {
              type: 0,
              value: this.form.name
            }
          } else {
            params = {
              type: 1,
              mark: this.form.mark,
              value: this.imageUrl
            }
          }
          Interface.getData('post', Interface.share.post, params).then(res => {
            if (res.data.code == 200) {
              this.dialogVisible = false
              this.$message.success('添加成功！')
              this.form.name = ''
              this.fetch('list')
            }
          })
        } else { //修改
          if (this.activeName == 0) {
            params = {
              type: 0,
              value: this.form.name,
              _method: 'PUT'
            }
          } else {
            params = {
              type: 1,
              mark: this.form.mark,
              value: this.imageUrl,
              _method: 'PUT'
            }
          }
          Interface.getData('post', `${Interface.share.post}/${this.editId}`, params).then(res => {
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
          _method: 'DELETE'
        }
        this.$confirm('是否确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Interface.getData('post', Interface.share.delete + '/' + row.id, params).then(res => {
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
