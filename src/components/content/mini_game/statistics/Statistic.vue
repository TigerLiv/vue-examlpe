<template>
  <div class="container statistics" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col style="height:320px;margin:20px 0">
        <div>
          <span>时间筛选</span>
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
            @change="timeChange" default-value="2018-01-09">
          </el-date-picker>
        </div>
        <div id="chartLine" class="chart"></div>
      </el-col>
    
    </el-row>
  
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
        lightName:[],
        lightNum:[],
        skipNum:[]
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
          this.lightName=[]
          this.lightNum=[]
          this.skipNum=[]
          this.endTime=parseInt((new Date().getTime())/1000);
          let params={
            start_time: this.startTime,
            end_time: this.endTime
          }
          console.log(params)
              Interface.getData('get',Interface.light.statistics,params).then(res=>{
                if (res.data.code==200) {
                  var data=res.data.data;
                  data.forEach(val=>{
                    this.lightName.push(val.name)
                  })

                  data.forEach(val=>{
                    this.lightNum.push(val.light_num)
                  })
                  
                  data.forEach(val=>{
                    this.skipNum.push(val.skip_num)
                  })
                }
                this.initChart()
                this.loading = false
        })
       
        } 
      },
      edit(row) {
        this.dialogFormVisible = true
        this.add_num = row.add_num
        this.editId = row.id
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
            data: this.lightName,
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
              name: '实时点灯数',
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
              data: this.lightNum,
              animationDuration,
              animationEasing: 'cubicInOut'
            },
            {
              name: '分享次数',
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
              data: this.skipNum,
              animationDuration,
              animationEasing: 'quadraticOut'
            }]
        })
      }
    },
    mounted() {
      // this.initChart()
      this.fetch('list')
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