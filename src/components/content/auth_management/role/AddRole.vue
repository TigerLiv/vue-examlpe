<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="角色名">
        <el-input v-model="form.name" placeholder="请输入角色名"></el-input>
      </el-form-item>

      <el-form-item label="群组" prop="group_id">
        <el-select v-model="form.group_id" @change="valueChange('group',$event)" :disabled="roleId != 0">
          <el-option v-for="(item,index) in groupOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置管理员" v-if="!set_manage">
        <el-radio-group v-model="status" v-if="">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="群组子列表" v-if="groupChildOptions.length != 0" :disabled="roleId != 0">
        <el-radio-group v-model="form.child_id">
          <el-radio :label="item.id" v-for="item in groupChildOptions" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模块权限">
        <el-tree ref="tree" :data="module_list" :default-expanded-keys="[1, 6]" show-checkbox node-key="id" :props="defaultProps">
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('submit')" v-loading.fullscreen.lock="fullscreenLoading" :disabled="forbid">保存</el-button>
        <el-button @click="edit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  import Interface from '@/util/interface.js';
  export default {
    data() {
      return {
        forbid: false,
        form: {},
        fullscreenLoading: false,
        options: [],
        project_id: '',
        module_list: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        groupOptions: [],
        groupChildOptions: [],
        roleId: this.$route.params.id,
        roles: eval("(" + sessionStorage.getItem('roles') + ")"),
        status: '',
        set_manage:1,
        groupIndex:0,
      }
    },
    methods: {
      fetch(scence, params) {
        if ('module_list' == scence) { //获取当前角色的组下面的模块分类
          let params = {}
          if (this.form.child_id) {
            params.group_id = this.form.child_id
          } else {
            params.group_id = this.form.group_id
          }
         
          params.set = 1
          this.module_list = [];
          Interface.getData('get', Interface.management.get_module, params).then(response => {
            if (!response.data.data || response.data.code != 200) return;
             console.log(this.form.group_id,'当前组下的模块')
             this.module_list = response.data.data
          }).then(() => {
            //获得当前角色下面的模块
            Interface.getData('get', Interface.management.role_module, {
              role_id: this.$route.params.id
            }).then(
              response => {
                let checked = []
                if (response.data.code == 200) {
                  let data = response.data.data
                  data.forEach(elem => {
                    if (elem.child) {
                      elem.child.forEach(val => {
                        checked.push(val.id)
                      })
                    }
                  })
                  console.log(checked)
                  this.$refs.tree.setCheckedKeys(checked);
                }
              })
          })
        } else if ('group' == scence) { //获取组的列表
          let group_id = this.roles[0].group_id
          Interface.getData('get', Interface.management.group, {
            id: group_id
          }).then(res => {
            if (res.data.code == 200) {
              this.groupOptions = res.data.data
              this.groupOptions.forEach(val => {
                if(val.id == this.form.group_id){
                  this.set_manage = val.set_manage
                  console.log(val.set_manage,'当前组的是否设置有管理员')
                }
              })
            }
          })
        }
      },
      edit(scence, param) {
        if ('cancel' == scence) {
          this.$router.go(-1);
        } else if ('handle_role') { //给角色修改或添加模块
          let string = '';
          let checked = this.$refs.tree.getCheckedNodes();
          this.module_list.forEach(function (element) {
            checked.forEach(function (ele, index) {
              if (element.child.indexOf(ele) > -1) {
                string += element.id.toString() + ',';
              }
              string += ele.id.toString();
              string += ',';
            }, this);
          }, this);
          let arr = Interface.deleteRepetionChar(string);
          arr.splice(arr.length - 1, 1);
          string = arr.join(',');
          let params = {
            role_id: param,
            modules: '[' + string + ']'
          }
          Interface.getData('post', Interface.management.role_module, params).then(
            response => {
              if (response.data.code != 50002) {
                this.forbid = false
                this.confirm('success', '添加成功');
                this.$router.go(-1);
              } else if (response.data.code == 50002) {
                this.confirm('error', '当前角色已经存在！');
              }

            })
        }
      },
      confirm(scence, params) {
        if ('success' == scence) {
          this.$message({
            showClose: true,
            message: params,
            type: 'success'
          });
        } else if ('error' == scence) {
          this.$message({
            showClose: true,
            message: params,
            type: 'error',
          });
        }
      },
      valueChange(scence, params,set) {
        if ('group' == scence) {
          this.groupOptions.forEach(val => {
            if(val.id == params){
              this.set_manage = val.set_manage
            }
          })
          let param = {
            id: params
          }
          Interface.getData('get', Interface.management.group, param).then(res => {
            if (res.data.code == 200) {
              this.groupChildOptions = res.data.data
            }
          }).then(() => {
            this.fetch('module_list')
          })
        }
      },
      save(scence, params) {
        this.forbid = true
        if ('submit' == scence) {
          let params = {}
          if (this.$route.params.id == 0) {
            params.name = this.form.name
            params.set_manage = this.status
            if (this.form.child_id) {
              params.group_id = this.form.child_id
            } else {
              params.group_id = this.form.group_id
            }
            //添加角色
            Interface.getData('post', Interface.management.group_role, params).then(response => {
              if (200 == response.data.code) {
                this.forbid = false
                let data = response.data.data;
                this.edit('handle', data.id)
              } else {
                this.confirm('error', '当前角色已经存在！');
              }
            })
          } else {
            //修改角色
            let params = {
              name: this.form.name,
              set_manage:this.status,
              _method: 'PUT'
            }
            Interface.getData('post', `${Interface.management.group_role}/${this.$route.params.id}`, params).then(
              response => {
                if (200 == response.data.code) {
                  this.forbid = false
                  let data = response.data.data;
                  this.edit('handle', this.$route.params.id)
                } else {
                  this.confirm('error', '当前角色已经存在！');
                }
              })
          }

        }
      },
      delete(scence, params) {},
      test() {}
    },
    created() {
      this.fetch('group');
      if (this.$route.params.id != '0') { //编辑获得角色信息
        Interface.getData('get', `${Interface.management.get_role}/${this.$route.params.id}`).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data
            this.form.name = data.name;
            this.form.group_id = data.group_id 
            this.fetch('module_list')
          }
        })
      }
    }
  }

</script>
<style lang="scss">


</style>
