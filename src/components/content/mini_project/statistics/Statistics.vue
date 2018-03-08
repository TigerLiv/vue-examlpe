<template>
  <div class="container statistics" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col :span="4" :offset="1" class="card">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <count-to class="card-panel-num" :startVal="0" :endVal="assess.day_num" :duration="2500"></count-to>
            <el-button type="text" class="button">今日评估量（人次）</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" :offset="2" class="card">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <count-to class="card-panel-num" :startVal="0" :endVal="phone.day_num" :duration="3000"></count-to>
            <el-button type="text" class="button">今日留电量（人次）</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" :offset="2" class="card">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <count-to class="card-panel-num" :startVal="0" :endVal="assess.total_num + assess.add_num" :duration="3500"></count-to>
            <el-button type="text" class="button">总评估量（人次）</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" :offset="2" class="card">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <count-to class="card-panel-num" :startVal="0" :endVal="phone.total_num" :duration="4000"></count-to>
            <el-button type="text" class="button">总留电量（人次）</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col style="height:320px;margin:20px 0">
        <div>
          <span>时间筛选</span>
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
            @change="timeChange" default-value="2018-01-09">
          </el-date-picker>
        </div>
        <div id="chartLine" class="chart"></div>
      </el-col>
      <el-col style="margin-top:50px;">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" align="center">
          <el-table-column prop="total_num" label="实际评估量"></el-table-column>
          <el-table-column prop="add_num" label="扩充人数"></el-table-column>
          <el-table-column label="总评估量">
            <template slot-scope="scope">
              <span>{{scope.row.total_num + scope.row.add_num}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div>
      <el-dialog :visible.sync="dialogFormVisible">
        <el-form label-width="100px">
          <el-form-item label="扩充人数">
            <el-input v-model="add_num" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <template slot-scope="scope">
              <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" size="small" @click="save">确定</el-button>
            </template>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons')
  import CountTo from 'vue-count-to'
  const animationDuration = 5000
  import Interface from '@/util/interface.js'
  import axios from 'axios'
  export default {
    data() {
      return {
        loading: true,
        chart: null,
        tableData: [],
        time: [new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), new Date()],
        startTime: null,
        endTime: null,
        assess: {},
        phone: {},
        totalAssess: [],
        totalPhone: [],
        days: [],
        pickerOptions: {
          disabledDate(time) {
            // console.log(time)
            return time.getTime() < new Date(2017, 12, 1);
          },
          onPick({ maxDate, minDate }) {
            // console.log(minDate,maxDate,'time')
          }
        },
        dialogFormVisible: false,
        add_num: '',
        editId: '',
      }
    },
    components: {
      CountTo,
    },
    methods: {
      fetch(scence) {
        if ('assess' == scence) {
          let params = {
            identify: 'assess',
            start_time: this.startTime,
            end_time: this.endTime
          }
          return Interface.getData('get', Interface.statistics.get, params)
        } else if ('phone' == scence) {
          let params = {
            identify: 'phone',
            start_time: this.startTime,
            end_time: this.endTime
          }
          return Interface.getData('get', Interface.statistics.get, params)
        } else if ('list' == scence) {
          axios.all([this.fetch('assess'), this.fetch('phone')]).then(
            axios.spread((acct, perms) => {
              let assessData = acct.data.data //总评估量
              let phoneData = perms.data.data //留电量
              this.days = []
              this.totalAssess = []
              this.totalPhone = []
              if (assessData.length == 0) {
                this.$message.info('暂无相关数据！')
              }
              assessData.forEach(elem => {
                this.totalAssess.push(elem.day_num)
                this.days.push(elem.day_name.slice(6))
              })
              phoneData.forEach(elem => {
                this.totalPhone.push(elem.day_num)
              })
              console.log(acct, '评估')
              console.log(perms, '留电')
            })
          ).then(() => {
            this.initChart()
            this.loading = false
          })
        } else if ('today' == scence) {
          Interface.getData('get', Interface.statistics.get_today, { identify: 'assess' }).then(res => {
            if (res.data.code == 200) {
              if (res.data.data) {
                this.assess = res.data.data
                this.tableData = []
                this.tableData.push(res.data.data)
              }
            }
          }).then(() => {
            Interface.getData('get', Interface.statistics.get_today, { identify: 'phone' }).then(res => {
              if (res.data.code == 200) {
                if (res.data.data) {
                  this.phone = res.data.data
                }
              }
            })
          })
        }
      },
      edit(row) {
        this.dialogFormVisible = true
        this.add_num = row.add_num
        this.editId = row.id
      },
      save() {
        let params = {
          add_num: this.add_num,
          identify: 'assess'
        }
        Interface.getData('post', Interface.statistics.put, params).then(res => {
          if (res.data.code == 200) {
            this.$message.success('成功')
            this.dialogFormVisible = false
            this.fetch('today')
          } else {
            this.dialogFormVisible = false
            this.$message.error('失败')
          }
        })
      },
      timeChange(val) {
        this.startTime = val[0].getTime() / 1000
        this.endTime = val[1].getTime() / 1000
        this.fetch('list')
      },
      initChart() {
        let chart = echarts.init(document.getElementById('chartLine'))
        chart.setOption({
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            padding: [20, 20],
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'cross' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            y:'5%',
            top:'-5px',
            data: ['总评估量', '总留电量']
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: this.days,
            axisTick: {
              alignWithLabel: true,
              axisTick: false,
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [
            {
              name: '总评估量',
              itemStyle: {
                normal: {
                  color: '#FF005A',
                  lineStyle: {
                    color: '#FF005A',
                    width: 2
                  }
                }
              },
              smooth: true,
              type: 'line',
              stack: 'vistors',
              barWidth: '60%',
              data: this.totalAssess,
              animationDuration,
              animationEasing: 'cubicInOut'
            },
            {
              name: '总留电量',
              itemStyle: {
                normal: {
                  color: '#3888fa',
                  lineStyle: {
                    color: '#3888fa',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              smooth: true,
              type: 'line',
              stack: 'vistors',
              barWidth: '60%',
              data: this.totalPhone,
              animationDuration,
              animationEasing: 'quadraticOut'
            }]
        })
      }
    },
    mounted() {
      // this.initChart()
      this.fetch('list')
      this.fetch('today')
    },
    created() {
    }
  }
</script>
<style lang="scss">
  .statistics {
    text-align: center
  }

  .chart {
    height: 95%;
    margin-top: 20px;
  }

  .card-panel-num {
    font-size: 20px;
    font-weight: 500;
  }
</style>