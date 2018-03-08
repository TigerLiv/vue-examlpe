<template>
  <div class="container">
    <el-table :data="tableData" style="width:1080px;">
      <el-table-column prop="name" label="灯类型" width="160"></el-table-column>
      <el-table-column label="关联国家" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.attr">
            <span v-for="item in scope.row.attr.country_data">{{item.title}} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联移民目的" width="260">
        <template slot-scope="scope">
          <div v-if="scope.row.attr">
            <span v-for="item in scope.row.attr.immigrant_data">{{item.title}} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="attr.light_desc" label="内容详情" width="260"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="editpic(scope.row)">修改图片</el-button>

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
        startTime: null,
        endTime: null,
        id:'',
        countryData:[],
      }
    },
    methods: {
      fetch() {
        let params = {
          source: 'back'
        }
        Interface.getData('get', Interface.light.get, params).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data
            this.tableData = data
            console.log(this.tableData);
          }
        })
      },
      edit(row) {  
         this.$router.push('/editlight/' + row.id)
      },
      timeChange(scence) {
        this.fetch()
      },
      pageChange(num) {
        this.currentPage = num
        this.fetch()
      },
      editpic(row){
        this.$router.push('/editlightpic/'+row.id);
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
