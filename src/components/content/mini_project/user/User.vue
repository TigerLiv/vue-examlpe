<template>
  <div class="container">
    <div class="block">
      <span class="demonstration">筛选：</span>
      <el-date-picker id="start" v-model="startTime" align="right" type="datetime" placeholder="选择开始日期" @change="timeChange('start',$event)">
      </el-date-picker>
      <el-date-picker id="end" v-model="endTime" align="left" type="datetime" placeholder="选择结束日期" @change="timeChange('end',$event)">
      </el-date-picker>
      <el-button type="primary" class="output" @click="edit()">导出</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="props">
              <div class="demo-table-expand" v-for="item in props.row.subscribes" v-if="item.project_name != ''">
                <span class="label">{{item.created_at}}</span>
                <span>{{item.project_name}}</span>
              </div>
            </template>
        </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
      <el-table-column prop="city" label="地区" width="120">
        <template  slot-scope="props">
          <span>{{props.row.country}} - {{props.row.province}} - {{props.row.city}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="wechat_phone" label="默认手机号" width="120"></el-table-column>
      <el-table-column prop="tel" label="自填手机号" width="120"></el-table-column>
      <el-table-column prop="share_num" label="今日分享频次"></el-table-column>
      <el-table-column prop="total_share_num" label="分享总频次" width="120"></el-table-column>
      <el-table-column prop="share_user_name" label="介绍人" width="120"></el-table-column>
      <el-table-column prop="share_source" label="进入来源"></el-table-column>
      <!-- <el-table-column prop="subscribe_name" label="预约回电">
        <template slot-scope="props">
          <span class="subscribe-name">{{props.row.subscribe_name}}</span>
        </template>
      </el-table-column> -->
    </el-table>
    <div style="margin:15px 0;">
      <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"> </el-pagination>
    </div>
  </div>
</template>
<script>
  import Interface from '@/util/interface.js'
  export default {
    data() {
      return {
        tableData: [],
        value6: '',
        total: 1,
        currentPage: 1,
        startTime: null,
        endTime: null,
      }
    },
    methods: {
      fetch() {
        let params = {
          page: this.currentPage,
          pageSize: 10,
          start_time: new Date(this.startTime).getTime() / 1000,
          end_time: new Date(this.endTime).getTime() / 1000
        }
        Interface.getData('get', Interface.user.get, params).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data.data
            this.total = res.data.data.total;
            this.tableData = data
            data.forEach(element => {
              if(element.subscribes.length != 0){
                element.subscribes.forEach(val => {
                  val.created_at = Interface.getTime(val.created_at)
                })
              }

            });
          }
        })
      },
      edit() {
        let start_time = new Date(this.startTime).getTime() / 1000;
        let end_time = new Date(this.endTime).getTime() / 1000;
        let host = ''
        if (location.hostname == 'localhost') {
          host = 'https://tpy-api.qeebu.com/user/export?'
        } else {
          host = '/api/user/export?'
        }
        window.open(host + 'start_time=' + start_time + '&end_time=' + end_time)
      },
      timeChange(scence) {
        this.fetch()
      },
      pageChange(num) {
        this.currentPage = num
        this.fetch()
      }
    },
    created() {
      this.fetch()
    }
  }

</script>
<style lang="scss">
  .output {
    float: right;
    margin-right: 30px;
  }

  .block {
    margin-top: 15px;
    margin-bottom: 30px;
  }

  .subscribe-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap；
  }

  .demo-table-expand {
    width: 50%;
    float: left;
    margin-bottom: 10px;
  }

  .demo-table-expand .label {
    width: 90px;
    color: #99a9bf;
    margin-right: 20px;
  }


</style>
