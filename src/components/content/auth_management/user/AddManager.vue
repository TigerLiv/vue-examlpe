<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="120px" :rules="rights_rules">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" :disabled="role_type == 'detail'"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" :disabled="role_type == 'detail'"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" :disabled="role_type == 'detail'"></el-input>
      </el-form-item>
      <el-form-item label="群组">
        <el-select v-model="group_id" @change="valueChange('role_list',$event)">
          <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-radio-group v-model="child_id">
          <el-radio :label="item.id" v-for="item in groupChildOptions" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色选择">
        <el-select v-model="form.role" placeholder="请选择" :disabled="role_type == 'detail'">
          <el-option v-for="item in role_list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('submit', 'form')" v-loading.fullscreen.lock="fullscreenLoading" v-show="role_type == '0'"
          :disabled="forbid">立即创建</el-button>
        <el-button type="primary" @click="save('edit', 'form')" v-loading.fullscreen.lock="fullscreenLoading" v-show="role_type != '0'">提交</el-button>
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
        module_list: [],
        groupOptions: [],
        groupChildOptions: [],
        group_id: '',
        child_id: '',
        form_list: [],
        disable: false,
        add_list: [],
        role_list: [],
        role: '',
        old_role: '',
        role_type: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rights_rules: {
          username: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          nickname: [{
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      fetch(scence, params) {
        if ('role_list' == scence) {
          let param = {}
          if (this.child_id) {
            param.group_id = this.child_id
          } else {
            param.group_id = this.group_id
          }
          if (param.group_id == '') {
            this.$message.info('请先选择群组')
          } else {
            Interface.getData('get', Interface.management.get_role, param).then(res => {
              if (res.data.code == 200) {
                this.role_list = res.data.data
              }
            })
          }


        } else if ('group' == scence) {
          Interface.getData('get', Interface.management.group).then(res => {
            if (res.data.code == 200) {
              this.groupOptions = res.data.data
            }
          })
        }
      },
      edit(scence, params) {
        if ('cancel' == scence) {
          this.$router.push('/manage_user');
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
        this.forbid = true
        if ('submit' == scence) {
          let param = this.form
          param.roles = '[' + this.form.role +']'
          Interface.getData('post', Interface.management.auth, param).then(response => {
            if (200 == response.data.code) {
              this.forbid = false
              this.confirm('success', '成功');
              this.$router.go(-1);
            } else {
              this.confirm('error', '此用户已存在');
            }
          }).catch(error => {
            this.confirm('error', '请先添加角色');
          })
        } else if ('add' == scence) {
          let data = this.form_list[params];
          if (data.disable) {
            data.disable = false;
            return;
          }
          if (!data.project_id || data.role_id.length <= 0) {
            this.confirm('error', '请确认项目或者角色已经添加');
            return;
          }
          data.disable = true;
          this.add_list.push(data);
        } else if ('edit' == scence) {
          let param = this.form
          param.role = this.old_role
          param.user_role = this.role
          param._method = 'PUT'
          Interface.getData('post', Interface.user.post + '/' + this.$route.params.id, param).then(response => {
            if (200 == response.data.code) {
              this.forbid = false
              this.confirm('success', '修改成功');
              this.$router.go(-1);
            } else {
              this.confirm('error', '此用户已存在');
            }
          }).catch(error => {
            this.confirm('error', '请先添加角色');
          })
        }
      },
      valueChange(scence, params) {
        if ('role_list' == scence) {
          this.fetch('role_list')
        }
      }
    },
    created() {
      this.fetch('group')
      // this.fetch('role_list');
      this.role_type = this.$route.params.id;
      if (this.$route.params.type == 'add') {
        this.disable = false;
      } else if (this.$route.params.type == 'edit' || this.$route.params.type == 'detail') {
        var params = {
          role: this.$route.params.role
        };
        Interface.getData('get', Interface.user.get + '/' + this.$route.params.id, params)
          .then(res => {
            if (res.data.code == 200) {
              let data = res.data.data;
              this.form.u_tel = data.u_tel;
              this.form.u_nickname = data.u_nickname;
              this.form.u_password = '';
              this.role = data.r_role_id;
              this.old_role = data.r_role_id;
            }
          })
      }

    }
  }

</script>
<style lang="scss">


</style>
