<template>
  <div class="container">
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane label="首页banner" name="1"></el-tab-pane>
          <el-tab-pane label="出国大事件" name="2"></el-tab-pane>
          <el-tab-pane label="资质荣誉" name="3"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1" :offset="4">
        <el-button @click="add">添加</el-button>
      </el-col>
      <el-col>
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column prop="picture" label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.picture" alt="" width="50px" height="50px;">
              </template>
            </el-table-column>
            <el-table-column prop="position" label="位置" v-if="activeName == 1"></el-table-column>
            <el-table-column prop="link" label="链接" v-if="activeName == 1"></el-table-column>
            <el-table-column prop="intro" label="简介" v-if="activeName == 2"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="edit('top',scope.row)">{{tableData[scope.$index].status == 1?'下架':'上架'}}</el-button>
                <el-button type="text" size="small" @click="edit('sort',scope.row)">修改排序</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col>
        <el-dialog title="" :visible.sync="dialogVisible">
          <el-form :model="form" label-width="120px" :rules="rules" ref="form">
            <el-form-item label="类型" prop="category">
              <el-radio-group v-model="form.category">
                <el-radio :label="'1'" :key="1">首页banner</el-radio>
                <el-radio :label="'2'" :key="2">出国大事件</el-radio>
                <el-radio :label="'3'" :key="3">资质荣誉</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <el-input v-model="form.picture" auto-complete="off" v-show="false"></el-input>
              <single-image ref="topicImage" @getUrl="getFile"></single-image>
            </el-form-item>
            <el-form-item label="跳转的地址" prop="link" v-if="form.category == 1">
              <el-input v-model="form.link" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="intro" v-if="form.category == 2">
              <el-input type="textarea" v-model="form.intro" auto-complete="off" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="banner位置" prop="sort">
              <el-radio-group v-model="form.main_push">
                <el-radio v-for="item in positionOptions" :label="item.id" :key="item.id">{{item.title}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否上架" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="'1'" :key="1">是</el-radio>
                <el-radio :label="'0'" :key="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="modelBtn">
              <el-button @click="cancel('form')">取 消</el-button>
              <el-button type="primary" @click="save">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog title="" :visible.sync="sortVisible">
          <el-form>
            <el-form-item>
              <el-input v-model="sort"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="sortVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveSort">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
      <el-col style="margin:15px 0;">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange" v-if="total != 0"> </el-pagination>
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
        activeName: this.$store.state.bannerActiveName,
        total: 0,
        currentPage: 1,
        categoryOptions: [],
        positionOptions: [],
        category_id: '',
        tableData: [],
        id: '',
        editId: '',
        forbid: false,
        dialogVisible: false,
        sortVisible: false,
        form: {
          category: '1'
        },
        rules: {
          link: [{
            required: true,
            message: '请输入跳转链接',
            trigger: 'blur'
          }],
          picture: [{
            required: true,
            message: '请上传banner图片',
            trigger: 'change'
          }],
          status: [{
            required: true,
            message: '请输入专题名称',
            trigger: 'blur'
          }],
          intro: [{
            required: true,
            message: '请输入簡介',
            trigger: 'blur'
          }],
          sort: [{
              required: true,
              message: '排序不能为空'
            },
            {
              type: 'number',
              message: '排序必须为数字值'
            }
          ]
        },
        status: true,
        topicOptions: [],
        ids: '',
        sortId:'',
        sort: '',
        sorts: [],
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
          category: this.activeName,
          backend: 1
        }
        if ('list' == scence) {
          Interface.getData('get', Interface.website.banner.get, params).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data.data
              this.total = res.data.data.total
              this.tableData = data;
            } else if (res.data.code == 40001) {
              this.tableData = []
              this.total = 0
            }
          })
        } else if ('position' == scence) {
          Interface.getData('get', Interface.website.banner.postion).then(res => {
            if (res.data.code == 200) {
              this.positionOptions = res.data.data
            }
          })
        }
      },
      add() {
        this.dialogVisible = true;
        this.status = true
        this.cancel
        setTimeout(() => {
          this.$refs.topicImage.imageUrl = ''
        }, 100)
      },
      edit(scence, row) {
        if ('edit' == scence) {
          this.dialogVisible = true
          this.status = false
          this.editId = row.id
          setTimeout(() => {
            this.$refs.topicImage.imageUrl = row.picture
          }, 100)
          Interface.getData('get', `${Interface.website.banner.post}/${row.id}`).then(res => {
            if (res.data.code == 200) {
              this.form = res.data.data
              this.form.status = res.data.data.status.toString()
              this.form.category = res.data.data.category.toString()
            }
          })
        } else if ('top' == scence) {
          let params = {
            ids: `[${row.id}]`,
          }
          if (row.status) {
            params.status = 0
          } else {
            params.status = 1
          }
          Interface.getData('post', Interface.website.banner.updateStatus, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功！')
              this.fetch('list')
            }
          })
        } else if ('sort' == scence) {
          this.sortVisible = true
          this.sort = row.sort
          this.sortId = row.id
        }
      },
      save() {
        let params = {}
        if (this.form.category == '1') {
          params = {
            category: this.form.category,
            picture: this.form.picture,
            link: this.form.link,
            status: this.form.status,
            sort: this.form.sort
          }
        } else if (this.form.category == '2') {
          params = {
            category: this.form.category,
            picture: this.form.picture,
            intro: this.form.intro,
            status: this.form.status,
            sort: this.form.sort
          }
        } else {
          params = {
            category: this.form.category,
            picture: this.form.picture,
            status: this.form.status,
            sort: this.form.sort
          }
        }
        if (this.status) { //添加
          Interface.getData('post', Interface.website.banner.post, params).then(res => {
            if (res.data.code == 200) {
              this.cancel('form')
              this.$message.success('添加成功！')
              this.fetch('list')
            }
          })
        } else { //修改
          params._method = 'PUT'
          Interface.getData('post', `${Interface.website.banner.post}/${this.editId}`, params).then(res => {
            if (res.data.code == 200) {
              this.cancel('form')
              this.$message.success('修改成功！')
              this.status = true
              this.fetch('list')
            }
          })
        }
      },
      saveSort() {
        this.sorts.push({
          id: this.sortId,
          sort: this.sort
        })
        let params = {
          sorts: `${JSON.stringify(this.sorts)}`
        }
        Interface.getData('post', Interface.website.banner.updateSort, params).then(res => {
          if (res.data.code == 200) {
            this.sortVisible = false
            this.$message.success('成功！')
            this.fetch('list')
          }
        })
      },
      cancel(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false
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
          Interface.getData('post', Interface.website.banner.delete + '/' + row.id, params).then(res => {
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
        this.form.picture = url
      },
      tabclick(tab) {
        this.$store.state.bannerActiveName = tab.name
        this.fetch('list')
      }
    },
    created() {
      this.fetch('list')
      this.fetch('position')
    }
  }

</script>
<style scoped lang="scss">
  @import '../../../../assets/css/container.css';
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
