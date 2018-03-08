<template>
    <div class="container">
      <el-row>
        <el-col :span="18">
          <el-tabs v-model="activeName" @tab-click="tabclick">
            <el-tab-pane label="定制方案" name="custom"></el-tab-pane>
            <el-tab-pane label="项目对比" name="project_contrast"></el-tab-pane>
            <el-tab-pane label="领取资料" name="collect_information"></el-tab-pane>
            <el-tab-pane label="惊喜放送" name="surprise"></el-tab-pane>
            <el-tab-pane label="活动预约" name="activity"></el-tab-pane>
            <el-tab-pane label="国家对比" name="state_contrast"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col>
          <div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
              <el-table-column prop="username" label="用户"></el-table-column>
              <el-table-column prop="content" label="内容"></el-table-column>
              <el-table-column prop="tel" label="电话"></el-table-column>
              <!-- <el-table-column prop="source" label="来源"></el-table-column> -->
              <!-- <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                  <el-button type="text" size="small" @click="edit('top',scope.row)">{{tableData[scope.$index].status == 1?'下架':'上架'}}</el-button>
                  <el-button type="text" size="small" @click="edit('sort',scope.row)">修改排序</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
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
          activeName: 'custom',
          total: 0,
          currentPage: 1,
          tableData:[]
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
            source: this.activeName,
          }
          if ('list' == scence) {
            Interface.getData('get', Interface.website.collect.get, params).then((res) => {
              if (res.data.code == 200) {
                let data = res.data.data.data
                this.total = res.data.data.total
                this.tableData = data;
              } else if (res.data.code == 40001) {
                this.tableData = []
                this.total = 0
              }
            })
          }
        },
        pageChange(num) {
          this.currentPage = num;
          this.fetch('list')
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
  