<template>
  <div class="container">
    <div class="block">

      <span>时间筛选</span>
        <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
            @change="timeChange" default-value="2018-01-09">
        </el-date-picker>
      <!-- <el-button type="primary" class="output" @click="edit()">导出</el-button> -->
    </div>
    <el-table :data="tableData" style="width: 1080px;">
      <el-table-column prop="user_nickname" label="昵称" width="135"></el-table-column>
      <el-table-column prop="user_province" label="地区" width="135"></el-table-column>
      <el-table-column prop="user_wechat_phone" label="默认手机号" width="135"></el-table-column>
      <el-table-column prop="wish_receive_num" label="收到祝福量" width="135"></el-table-column>
      <el-table-column prop="wish_send_num" width="135" label="送出祝福量"></el-table-column>
      <el-table-column prop="today_share_num" label="今日分享频次" width="135"></el-table-column>
      <el-table-column prop="total_share_num" label="分享总次数" width="135"></el-table-column>
      <el-table-column label="操作" width="120">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
      </template>
      </el-table-column>
     
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
        time: [new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), new Date()],
        startTime: null,
        endTime: null,
        pickerOptions: {
          disabledDate(time) {
            // console.log(time)
            return time.getTime() < new Date(2017, 12, 1);
          },
          onPick({ maxDate, minDate }) {
            // console.log(minDate,maxDate,'time')
          }
        }
      }
    },
    methods: {
      fetch() {
        let params = {
          page: this.currentPage,
          start_time: parseInt(new Date(this.startTime).getTime() / 1000),
          end_time: parseInt(new Date(this.endTime).getTime() / 1000)
        }
        Interface.getData('get',Interface.light.user,params).then(res=>{
          if (res.data.code==200) {
            let data=res.data.data.data;
            this.tableData=data;
            this.total=res.data.data.total;
            console.log(data);
          }
        })      
      },
      edit(row) {
         this.$router.push('/light-edituser/'+row.user_id);
      },
      timeChange(val) {
       
        this.startTime = val[0].getTime() / 1000
        this.endTime = val[1].getTime() / 1000
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
.el-table .cell{
  text-align: center;
}

</style>
