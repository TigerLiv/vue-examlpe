<template>
  <div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane v-for="item in options" :label="item.title" :name="item.id.toString()" :key="item.id"></el-tab-pane>
          <!-- <el-tab-pane label="项目群" name="2"></el-tab-pane> -->
        </el-tabs>
      </el-col>
      <el-col :span="1" :offset="4">
        <el-button @click="add">添加群</el-button>
      </el-col>
      <el-col>
        <el-select v-model="is_hot" @change="valueChange('hot',$event)" placeholder="请设置位置">
          <el-option label="设置热门" value="1"></el-option>
          <el-option label="取消热门" value="0"></el-option>
        </el-select>
        <el-select v-model="status" @change="valueChange('status',$event)" placeholder="请设置状态">
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
        </el-select>
        <!-- <el-date-picker v-model="startTime" align="right" type="datetime" placeholder="选择日期" @change="timeChange('start',$event)">
            </el-date-picker>
            <el-date-picker v-model="endTime" align="left" type="datetime" placeholder="选择日期" @change="timeChange('end',$event)">
            </el-date-picker> -->
      </el-col>
      <el-col>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="created_at" label="建群时间"></el-table-column>
            <el-table-column prop="title" label="群名称"></el-table-column>
            <el-table-column prop="user_count" label="现有人数"></el-table-column>
            <el-table-column prop="category_name" label="群类型"></el-table-column>
            <el-table-column prop="identify" label="群标记"></el-table-column>
            <el-table-column prop="master_name" label="群主名称"></el-table-column>
            <el-table-column prop="value" label="群主二维码">
              <template slot-scope="sco">
                <img :src="sco.row.qr_url" alt="" width="50px">
              </template>
            </el-table-column>
            <el-table-column prop="is_hot" label="位置"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="small" @click="edit('hot',scope.row)">{{tableData[scope.$index].is_hot == 0?'设为热门':'取消热门'}}</el-button>
                <el-button type="text" size="small" @click="edit('status',scope.row)">{{tableData[scope.$index].status == 1?'下架':'上架'}}</el-button> -->
                <el-button type="text" size="small" @click="edit('member',scope.row)">查看群友</el-button>
                <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
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
  import ImageUpload from '@/components/common_components/ImageUpload.vue';
  export default {
    data() {
      return {
        activeName: this.$store.state.groupActiveName,
        total: 0,
        currentPage: 1,
        categoryOptions: [],
        category_id: '',
        tableData: [],
        id: '',
        editId: '',
        forbid: false,
        form: {},
        imageUrl: '',
        is_hot: '',
        status: '',
        ids: '',
        options: [],
        loading: true,
      }
    },
    components: {
      'imageUpload': ImageUpload
    },
    methods: {
      fetch(scence) {

        if ('list' == scence) {
          let params = {
            page: this.currentPage,
            pageSize: 10,
            category: this.activeName,
          }
          Interface.getData('get', Interface.wx_group.get, params).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data.data
              data.forEach(element => {
                element.created_at = Interface.getTime(element.created_at)
                element.is_hot == 1?element.is_hot = '热门':element.is_hot = '非热门'
                element.status == 1?element.status = '已上架':element.status = '未上架'
              })
              this.tableData = data;
              this.total = res.data.data.total
              this.loading = false
            } else if (res.data.code == 40001) {
              this.tableData = []
              this.loading = false
            }
          })
        } else if ('category' == scence) {
          Interface.getData('get', Interface.wx_group.category).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data
              this.options = data
            }
          })
        }
      },
      add() {
        this.$router.push('/group/add')
      },
      edit(scence, row) {
        if ('edit' == scence) {
          this.$router.push('/group/' + row.id)
        } else if ('member' == scence) {
          this.$router.push(`/group-member/${row.id}`)
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
          Interface.getData('post', Interface.wx_group.delete + '/' + row.id, params).then(res => {
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
        if ('hot' == scence) {
          let params = {
            ids: `[${this.ids}]`,
            type: 'hot',
            value: value
          }
          Interface.getData('post', Interface.wx_group.put_status, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功')
              this.fetch('list')
              this.is_hot = ''
            } else {
              this.$message.error('失败')
            }
          })
        } else if ('status' == scence) {
          let params = {
            ids: `[${this.ids}]`,
            type: 'status',
            value: value
          }
          Interface.getData('post', Interface.wx_group.put_status, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功')
              this.fetch('list')
              this.status = ''
            } else {
              this.$message.error('失败')
            }
          })
        }
      },
      pageChange(num) {
        this.currentPage = num;
        this.fetch('list')
      },
      getFile(url) {
        this.imageUrl = url
      },
      tabclick(tab) {
        this.$store.state.groupActiveName = tab.name
        this.fetch('list')
      }
    },
    created() {
      this.fetch('list')
      this.fetch('category')
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