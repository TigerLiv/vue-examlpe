<template>
  <div class="container">
    <el-row>
      <el-col :span="1" :offset="21">
        <el-button @click="add">添加专题</el-button>
      </el-col>
      <el-col>
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="cover" label="封面">
              <template slot-scope="scope">
                <img :src="scope.row.cover" alt="" width="50px" height="50px;">
              </template>
            </el-table-column>
            <el-table-column prop="link" label="链接"></el-table-column>
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
          <el-form :model="form" label-width="100px" :rules="rules" ref="form">
            <el-form-item label="专题名称" prop="name">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="link">
              <el-input v-model="form.link" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="cover">
              <el-input v-model="form.cover" auto-complete="off" v-show="false"></el-input>
              <single-image ref="topicImage" @getUrl="getFile"></single-image>
            </el-form-item>
            <el-form-item label="专题类型" prop="category_id">
              <el-select v-model="topics" multiple placeholder="请选择专题类型" @change="valueChange('topic',$event)">
                <el-option v-for="item in topicOptions" :key="item.id" :label="item.title" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="modelBtn">
              <el-button @click="cancel('form')">取 消</el-button>
              <el-button type="primary" @click="save('form')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import Interface from '@/util/interface'
  import SingleImage from '@/components/common_components/SingleImage.vue';
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
            message: '请输入专题名称',
            trigger: 'blur'
          }],
          link: [{
            required: true,
            message: '请输入专题链接',
            trigger: 'blur'
          }],
          cover: [{
            required: true,
            message: '请上传专题图片',
            trigger: 'change'
          }],
          category_id: [{
            required: true,
            message: '请选择专题类型',
            trigger: 'change'
          }]
        },
        status: true,
        topicOptions: [],
        topics: [],
        ids: '',
      }
    },
    components: {
      SingleImage
    },
    methods: {
      fetch(scence) {
        let params = {
          page: this.currentPage,
          pageSize: 10,
          backend: 1,
        }
        if ('list' == scence) {
          Interface.getData('get', Interface.website.topic.get, params).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data.data
              this.tableData = data;
            } else if (res.data.code == 40001) {
              this.tableData = []
            }
          })
        } else if ('topic' == scence) {
          Interface.getData('get', Interface.project.category).then(res => {
            if (res.data.code == 200) {
              this.topicOptions = res.data.data
            }
          })
        }

      },
      add() {
        this.dialogVisible = true;
        this.status = true
        this.$refs.form.resetFields()
        // this.form.name = ''
        // this.form.link = ''
        setTimeout(() => {
          this.$refs.topicImage.imageUrl = ''
        }, 100)
        this.topics = []
      },
      edit(row) {
        this.dialogVisible = true
        this.status = false
        this.editId = row.id
        setTimeout(() => {
          this.$refs.topicImage.imageUrl = row.cover
        }, 100)
        Interface.getData('get', `${Interface.website.topic.post}/${row.id}`).then(res => {
          if (res.data.code == 200) {
            this.form = res.data.data
            this.topics = []
            let ids = []
            ids = res.data.data.category_id.split(',')
            ids.forEach(val => {
              val = parseInt(val)
              this.topics.push(val)
            })
          }
        })
      },
      save(formName) {
        if (this.status) { //添加
          let params = this.form
          // params.category_id = this.ids
          this.$refs[formName].validate((valid) => {
            if (valid) {
              Interface.getData('post', Interface.website.topic.post, params).then(res => {
                if (res.data.code == 200) {
                  this.dialogVisible = false
                  this.$message.success('添加成功！')
                  this.fetch('list')
                }
              })
            } else {
              console.log('请填写完整！')
            }
          })

        } else { //修改
          let params = this.form
          // params.category_id = this.ids
          params._method = 'PUT'
          Interface.getData('post', `${Interface.website.topic.post}/${this.editId}`, params).then(res => {
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
          Interface.getData('post', Interface.website.topic.delete + '/' + row.id, params).then(res => {
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
      cancel(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      pageChange(num) {
        this.currentPage = num;
        this.fetch('list')
      },
      getFile(url) {
        this.form.cover = url
      },
      valueChange(scence, params) {
        if ('topic' == scence) {
          let tops = ''
          params.forEach((val, index) => {
            tops += val
            if (index < params.length - 1) {
              tops += ','
            }
          })
          // this.ids = tops
          this.form.category_id = tops
        }
      }
    },
    created() {
      this.fetch('list')
      this.fetch('topic')
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
