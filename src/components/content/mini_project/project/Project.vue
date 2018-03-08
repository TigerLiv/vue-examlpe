<template>
  <div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane label="项目列表" name=""></el-tab-pane>
          <el-tab-pane label="热门项目" name="is_hot"></el-tab-pane>
          <el-tab-pane label="热门搜索" name="hot_search"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1" :offset="4">
        <el-button type="primary" class="createProject" @click="add('add')">创建项目</el-button>
      </el-col>
      <el-col class="handle-status">
        <el-select v-model="is_hot" @change="valueChange('hot',$event)" placeholder="请设置是否热门项目">
          <el-option label="设置热门" value="1"></el-option>
          <el-option label="取消热门" value="0"></el-option>
        </el-select>
        <el-select v-model="status" @change="valueChange('status',$event)" placeholder="请设置状态">
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
        </el-select>
        <el-select v-model="hot_search" @change="valueChange('hot_search',$event)" placeholder="请设置是否热门搜索">
          <el-option label="设置热门搜索" value="1"></el-option>
          <el-option label="取消热门搜索" value="0"></el-option>
        </el-select>
        <el-input placeholder="请输入项目名称" suffix-icon="el-icon-search" v-model="condition" style="width:200px;float:right;" @blur="fetch('list')"></el-input>
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <div v-if="props.row.child.length != 0">
                    <div v-for="item in props.row.child" class="child-project">
                      <span>子项目名称：{{item.title}}</span>
                      <span>子项目优势：{{item.advantage}}</span>
                      <span>子项目简介：{{item.intro}}</span>
                      <el-button type="text" size="small" @click="edit('child',item)" style="width:85px">编辑</el-button>
                    </div>
                  </div>
                  <div v-else>
                    <span>该项目暂无子项目！</span>
                  </div>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="项目名称" width="150"></el-table-column>
            <el-table-column prop="country_name" label="所属国家"></el-table-column>
            <el-table-column prop="category_name" label="项目类型"></el-table-column>
            <el-table-column prop="status" label="项目状态"></el-table-column>
            <el-table-column prop="is_hot" label="项目位置"></el-table-column>
            <el-table-column prop="hot_search" label="热门搜索"></el-table-column>
            <el-table-column prop="search_count" label="搜索次数"></el-table-column>
            <el-table-column prop="intro" label="项目简介" width="200">
              <template slot-scope="scope">
                <span class="country_intro" v-html="scope.row.intro"></span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="edit('comment',scope.row)">相关评论</el-button>
                <el-button type="text" size="small" @click="add('child',scope.row)">添加子项目</el-button>
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
        currentPage: parseInt(this.$store.state.currentPage),
        loading: true,
        condition: '',
        is_hot: '',
        status: '',
        hot_search: '',
        ids: ''
      }
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          let params = {
            page: this.$store.state.currentPage,
            pageSize: 10,
            condition: this.condition,
            type: this.activeName
          }
          Interface.getData('get', Interface.project.get, params).then(res => {
            if (res.data.code == 200) {
              this.loading = false
              this.tableData = res.data.data.data
              this.total = res.data.data.total
              this.tableData.forEach(element => {
                element.is_hot == 1 ? element.is_hot = '热门' : element.is_hot = '非热门'
                element.status == 1 ? element.status = '已上架' : element.status = '未上架'
                element.hot_search == 1 ? element.hot_search = '是' : element.hot_search = '否'
              })
            } else {
              this.tableData = []
              this.total = 1
            }
          })
        }
      },
      add(scence, param) {
        if ('add' == scence) {
          this.$router.push('/project/add');
        } else if ('child' == scence) {
          this.$router.push(`/child_project/add/0`)
          sessionStorage.setItem('pid',param.id)
        }

      },
      edit(scence, row) {
        if ('edit' == scence) {
          this.$router.push(`/project/${row.id}`)
        } else if ('comment' == scence) {
          this.$router.push(`/project_comment/${row.id}`)
        } else if('child' == scence){
          this.$router.push(`/child_project/edit/${row.id}`)
          sessionStorage.setItem('pid',row.pid)
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
      //批量上下架
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
      valueChange(scence, value) {
        let params = {
          ids: `[${this.ids}]`,
          value: value
        };
        if ('hot' == scence) {
          params.type = 'hot'
        } else if ('status' == scence) {
          params.type = 'status'
        } else if ('hot_search' == scence) {
          params.type = 'hot_search'
        }
        if (this.ids == '') {
          this.$message.error('请先选择项目！')
          this.is_hot = ''
          this.status = ''
          this.hot_search = ''
        } else {
          Interface.getData('post', Interface.project.put_status, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功')
              this.fetch('list')
              this.is_hot = ''
              this.status = ''
              this.hot_search = ''
            } else {
              this.$message.error('失败')
            }
          })
        }

      },
      tabclick() {
        this.fetch('list')
      },
      pageChange(num) {
        // this.currentPage = num
        this.$store.state.currentPage = num
        this.currentPage = num
        this.fetch('list')
      },

    },
    created() {
      this.fetch('list')
    }
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
  .demo-table-expand .child-project span {
    display: inline-block;
    width: 29%;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
