<template>
  <div>
    <el-row>
      <el-col>
        <el-button type="primary" class="add-style" @click="add">添加管理员</el-button>
      </el-col>
      <el-col>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
          <el-table-column prop="username" label="账号"></el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Interface from '@/util/interface'
  export default {
    data() {
      return {
        groupOptions: [],
        groupChildOptions: [],
        tableData: [],
        form: {},
        group_id: '',
        child_id: '',
        roles:eval("(" + sessionStorage.getItem('roles') + ")"),

      }
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          Interface.getData('get', Interface.management.auth_list,{role_id:this.roles[0].role_id}).then(res => {
            if (res.data.code == 200) {
              this.tableData = res.data.data.data
            }
          })
        } 
      },
      edit(scence,params) {
        if('edit' == scence) {
          this.$router.push('auth/' + params.id)
        }
      },
      save() {
        
      },
      add() {
        this.$router.push('auth/0')
      },
    },
    created() {
      this.fetch('list')
    }
  }

</script>
