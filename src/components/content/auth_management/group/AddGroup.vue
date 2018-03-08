<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="组名">
        <el-input v-model="form.name" placeholder="请输入组名"></el-input>
      </el-form-item>
      <el-form-item label="模块权限">
        <el-tree ref="groupTree" :data="module_list" :default-expanded-keys="[1, 6]" show-checkbox node-key="id" :props="defaultProps">
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
        project_id: '',
        module_list: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        group_id: this.$route.params.id,
        pid: '',
        roles: eval("(" + sessionStorage.getItem('roles') + ")"),
      }
    },
    methods: {
      fetch(scence, params) {
        if ('module_list' == scence) { //获得父组下面所有的模块
          let params = {}
          if (this.roles[0].group_id == 0) { //超级管理员
            params.group_id = 0
          } else { //普通管理员
            params.group_id = this.roles[0].group_id
          }
          this.module_list = [];
          Interface.getData('get', Interface.management.get_module, params).then(response => {
            if (!response.data.data || response.data.code != 200) return;
            this.module_list = response.data.data
          }).then(() => { //获得当前组下的模块
            if (this.$route.params.type != 'add') {
              let params = {}
              if (this.roles[0].group_id == 0) { //超级管理员
                params.group_id = this.$route.params.id
              } else {
                params.group_id = this.roles[0].group_id
              }
              Interface.getData('get', Interface.management.get_module, params).then(res => {
                if (!res.data.data || res.data.code != 200) return;
                let checked = []
                let data = res.data.data
                data.forEach(elem => {
                  if (elem.child) {
                    elem.child.forEach(val => {
                      checked.push(val.id)
                    })
                  }
                })
                this.$refs.groupTree.setCheckedKeys(checked);
              })
            }
          })
        }
      },
      edit(scence, param) {
        if ('cancel' == scence) {
          this.$router.go(-1);
        } else if ('handle_group' == scence) {
          let string = '';
          let checked = this.$refs.groupTree.getCheckedNodes();
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
            group_id: param,
            modules: '[' + string + ']'
          }
          //给组添加或修改模块
          Interface.getData('post', Interface.management.group_module, params).then(
            response => {
              if (response.data.code != 50002) {
                this.forbid = false
                this.confirm('success', '添加成功');
                this.$router.go(-1);
              } else if (response.data.code == 50002) {
                this.confirm('error', '当前组已经存在！');
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
      save(scence, params) {
        this.forbid = true;
        let param = {};
        if ('submit' == scence) {
          if (this.$route.params.type == 'add') { //添加组
            let params = {}
            if (this.roles[0].group_id == 0) { //超级管理员
              params.pid = 0
            } else { //普通管理员
              params.pid = this.roles[0].group_id
            }
            param.name = this.form.name,
              Interface.getData('post', Interface.management.group, param).then(response => {
                if (200 == response.data.code) {
                  this.forbid = false
                  let data = response.data.data;
                  this.edit('handle_group', data.id)
                } else {
                  this.confirm('error', '当前组已经存在！');
                }
              })
          } else { //修改组
            param = {
              pid: this.pid,
              name: this.form.name,
              _method: 'PUT'
            }
            Interface.getData('post', `${Interface.management.group}/${this.group_id}`, param).then(response => {
              if (200 == response.data.code) {
                this.forbid = false
                let data = response.data.data;
                this.edit('handle_group', this.group_id)
              } else {
                this.confirm('error', '当前组已经存在！');
              }
            })
          }
          //添加组成功之后，再给角色添加或修改模块

        }
      },
      delete(scence, params) {},
      test() {}
    },
    created() {
      this.fetch('module_list');
      if (this.$route.params.type != 'add') { //修改获得群组信息
        Interface.getData('get', `${Interface.management.group}/${this.$route.params.id}`).then(res => {
          if (res.data.code == 200) {
            this.$set(this.form, 'name', res.data.data.name)
            this.pid = res.data.data.pid
          }
        })
      }
    }
  }

</script>
<style lang="scss">


</style>
