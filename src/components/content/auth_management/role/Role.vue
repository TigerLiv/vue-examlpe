<template>
  <div>
    <el-row>
      <el-col>
        <el-button type="primary" class="add-style" @click="add">添加角色</el-button>
        <el-select v-model="group_id" @change="valueChange('role_list',$event)">
          <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-radio-group v-model="child_id">
          <el-radio :label="item.id" v-for="item in groupChildOptions" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
          <el-table-column prop="name" label="角色名"></el-table-column>
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
        roles: eval("(" + sessionStorage.getItem('roles') + ")"),
      }
    },
    methods: {
      fetch(scence) {
        if ('group' == scence) {
          let group_id = this.roles[0].group_id
          Interface.getData('get', Interface.management.group,{id:group_id}).then(res => {
            if (res.data.code == 200) {
              this.groupOptions = res.data.data
              this.group_id = this.groupOptions[0].id
            }
          }).then(() => {

          })
        } else if ('list' == scence) {
          let param = {}
          if (this.child_id) {
            param.group_id = this.child_id
          } else {
            param.group_id = this.group_id
          }
          if (param.group_id == '') {
            this.$message.info('请选择群组')
          } else {
            Interface.getData('get', Interface.management.get_role, param).then(res => {
              if (res.data.code == 200) {
                this.tableData = res.data.data
              }
            })
          }

        }
      },
      edit(scence, params) {
        if ('edit' == scence) {
          this.$router.push('role/' + params.id)
        }
      },
      save() {

      },
      add() {
        this.$router.push('role/0')
      },
      valueChange(scence, params) {
        if ('group' == scence) {
          let param = {
            id: params
          }
          Interface.getData('get', Interface.management.group, param).then(res => {
            if (res.data.code == 200) {
              this.groupChildOptions = res.data.data
            }
          })
        } else if ('role_list' == scence) {
          this.fetch('list')
        }
      }
    },
    created() {
      this.fetch('group')
      setTimeout(() => {
        this.fetch('list')
      },500)
    },
  }

</script>
