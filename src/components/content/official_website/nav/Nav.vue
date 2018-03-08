<template>
  <div class="container">
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane label="首导航" name="1"></el-tab-pane>
          <el-tab-pane label="尾导航" name="2"></el-tab-pane>
          <el-tab-pane label="热门推荐" name="3"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1" :offset="4">
        <el-button type="primary" class="add-style" @click="status.dialogVisible = true;title='请添加一级导航'">添加一级导航</el-button>
      </el-col>
      <el-col>
        <!-- 导航表格 -->
        <el-table :data="tag" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.child" style="width: 100%" border v-if="props.row.child.length != 0">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table :data="props.row.child" style="width: 100%" v-if="props.row.child.length != 0">
                      <el-table-column label="三级导航名称" prop="title"></el-table-column>
                      <el-table-column label="排序" prop="sort"></el-table-column>
                      <el-table-column label="状态" prop="status"></el-table-column>
                      <el-table-column label="操作" width="160">
                        <template slot-scope="scope">
                          <!-- <el-button type="text" size="small" @click="add(scope.row)">添加</el-button> -->
                          <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
                          <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                          <el-button type="text" size="small" @click="edit('top',scope.row)">{{props.row.child[scope.$index].status == 1?'下架':'上架'}}</el-button>
                          <el-button type="text" size="small" @click="edit('sort',scope.row)">修改排序</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <span v-else>暂无下一级导航</span>
                  </template>
                </el-table-column>
                <el-table-column label="二级导航名称" prop="title"></el-table-column>
                <el-table-column label="排序" prop="sort"></el-table-column>
                <el-table-column label="状态" prop="status"></el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="add(scope.row)">添加</el-button>
                    <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="edit('top',scope.row)">{{props.row.child[scope.$index].status == 1?'下架':'上架'}}</el-button>
                    <el-button type="text" size="small" @click="edit('sort',scope.row)">修改排序</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <span v-else>暂无下一下导航</span>
            </template>
          </el-table-column>
          <el-table-column label="一级导航名称" prop="title"></el-table-column>
          <el-table-column label="排序" prop="sort"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="add(scope.row)">添加</el-button>
              <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="edit('top',scope.row)">{{tag[scope.$index].status == 1?'下架':'上架'}}</el-button>
              <el-button type="text" size="small" @click="edit('sort',scope.row)">修改排序</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 添加修改导航 -->
    <el-dialog :visible.sync="status.dialogVisible" class="dialog" :title="title" @close="closeDialog">
      <el-form :model="form" label-width="120px" :rules="rules" ref="form">
        <el-form-item label="类型" prop="category">
          <el-radio-group v-model="form.category">
            <el-radio :label="'1'" :key="1" :disabled="status.type == 'edit'">首导航</el-radio>
            <el-radio :label="'2'" :key="2" :disabled="status.type == 'edit'">尾导航</el-radio>
            <el-radio :label="'3'" :key="3" :disabled="status.type == 'edit'">热门推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导航名称" prop="title">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转的地址" prop="link">
          <el-input v-model="form.link" auto-complete="off"></el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="status.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改排序 -->
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
  </div>
</template>
<script>
  let id = 1000;
  import Interface from '@/util/interface'
  import qs from 'qs'
  export default {
    data() {
      return {
        activeName: '1',
        title: '请添加一级模块',
        tag: [],
        defaultProps: {
          children: 'child',
          label: 'title'
        },
        form: {},
        rules: {
          category: [{
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }],
          link: [{
            required: true,
            message: '请输入跳转链接',
            trigger: 'blur'
          }],
          title: [{
            required: true,
            message: '请输入导航名称',
            trigger: 'change'
          }],
          status: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }],
          sort: [{
            // type: 'number',
            required: true,
            message: '排序为数字'
          }, ]
        },
        appendId: 0,
        editId: 0,
        editName: '',
        status: {
          dialogVisible: false,
          type: 'add'
        },
        sorts: [],
        sort: '',
        sortId: '',
        sortVisible: false
      }
    },

    methods: {
      fetch() {
        this.tag = []
        Interface.getData('get', Interface.website.nav.get, {
          category: this.activeName
        }).then((res) => {
          if (res.data.code == 200) {
            this.tag = res.data.data
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      add(data) {
        this.status.dialogVisible = true;
        this.title = "请添加子级导航"
        this.status.type = 'append';
        this.appendId = data.id;
        this.form = {}
      },
      edit(scence, data) {
        if ('edit' == scence) {
          this.status.dialogVisible = true;
          this.title = "请修改子级导航"
          this.status.type = 'edit';
          this.editId = data.id;
          Interface.getData('get', `${Interface.website.nav.get}/${data.id}`).then(res => {
            if (res.data.code == 200) {
              this.form = res.data.data
              this.form.category = this.form.category.toString()
              this.form.status = this.form.status.toString()
            }
          })
        } else if ('sort' == scence) {
          this.sortVisible = true
          this.sort = data.sort
          this.sortId = data.id
        } else if ('top' == scence) {
          let params = {
            ids: `[${data.id}]`,
          }
          if (data.status) {
            params.status = 0
          } else {
            params.status = 1
          }
          Interface.getData('post', Interface.website.nav.updateStatus, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功！')
              this.fetch('list')
            }
          })
        }

      },
      destory(store, data) {
        var params = {
          id: data.id,
          _method: 'DELETE'
        }
        this.$confirm('是否确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post(Interface.website.nav.delete + '/' + data.id, qs.stringify(params))
            .then((res) => {
              if (res.status == 200) {
                location.reload() //删除成功之后页面刷新
                this.$message.success('删除成功！')
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      save() {
        var params = {}
        if (this.status.type == 'add') { //父级模块添加
          params = this.form
          params.pid = 0
          Interface.getData('post', Interface.website.nav.post, params)
            .then((res) => {
              if (res.data.code == 200) {
                this.status.dialogVisible = false;
                this.fetch()
              } else if (res.status == 200 && res.data.code == 4005) {
                this.$message.error('请勿添加重复的导航名！')
              }
            })
        } else if (this.status.type == 'append') { //子级模块添加
          params = this.form
          params.pid = this.appendId
          Interface.getData('post', Interface.website.nav.post, params)
            .then((res) => {
              if (res.data.code == 200) {
                this.status.dialogVisible = false;
                this.fetch()
              } else if (res.status == 200 && res.data.code == 4005) {
                this.$message.error('请勿添加重复的导航名！')
              }
            })
        } else if (this.status.type == 'edit') { //编辑
          params = this.form
          params._method = 'PUT'
          Interface.getData('post', Interface.website.nav.post + '/' + this.editId, params).then((res) => {
            if (res.data.code == 200) {
              this.status.dialogVisible = false;
              this.fetch()
              this.$message.success('修改成功')
            } else if (res.status == 200 && res.data.code == 4005) {
              this.$message.error('请勿修改重复的导航名！')
            }
          }).catch((err) => {
            console.log(err)
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
        Interface.getData('post', Interface.website.nav.updateSort, params).then(res => {
          if (res.data.code == 200) {
            this.sortVisible = false
            this.$message.success('成功！')
            this.fetch('list')
          }
        })
      },
      tabclick() {
        this.fetch()
      },
      closeDialog() {
        this.form.name = ''
      },
    },
    created() {
      this.fetch()
    }
  };

</script>
<style scoped>
  .el-tree {
    text-align: left;
  }

  .add-style {
    margin-bottom: 20px;
    float: right;
  }

  .el-dialog--small {
    width: 30% !important;
  }

</style>
