<template>
  <div class="login">
    <section class="login-page">
      <div class="login-form">
        <div class="form-title">太平洋出国后台管理</div>
        <!--<div class="form-img">
          <img src="../../../assets/image/pic_loading.png" alt="">
        </div>-->
        <div class="form-submit">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <el-form-item prop="username">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yonghuming"></use>
              </svg>
              <!-- <el-input placeholder="请输入您的用户名" v-model="ruleForm.username"></el-input> -->
              <el-input class="inputbg" style="border:0px solid #000;" v-model="ruleForm.username" placeholder="请输入您的用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-mima"></use>
              </svg>
              <el-input class="inputbg" type="password" placeholder="请输入您的密码" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <!--<el-checkbox label="下次自动登录" v-model="auto_login" class="auto-login"></el-checkbox>-->
            <!-- <el-checkbox @change="autoLogin" label="下次自动登录" v-model="auto_login"></el-checkbox> -->
            <el-form-item class="form-btn" style="height:40px;">
              <el-button class="login-btn" type="primary" :loading="loading" @click="save('submit','ruleForm')" @keyup.enter="save('submit','ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  import Interface from '@/util/interface'
  import icon from '@/assets/icon/iconfont.js'
  import qs from 'qs'
  export default {
    data() {
      return {
        is_login: false,
        loading: false,
        ruleForm: {},
        rules: {
          username: [{
            required: true,
            message: '请输入您的用户名',
            trigger: 'blur'
          }, ],
          // password: [{
          //   required: true,
          //   message: '请输入您的密码',
          //   trigger: 'blur'
          // }, ]
        },
        auto_login: false,
        module_menu: [],
      }
    },
    methods: {
      save(scence, params) {
        if ('submit' == scence) {
          this.$refs[params].validate((valid) => {
            if (valid) {
              this.loading = true;
              Interface.getData('post', Interface.user.login, this.ruleForm).then((res) => {
                this.loading = false;
                if (res.data.code == 200) {
                  let auth = {
                    logined: true
                  }
                  auth = Object.assign(auth, res.data.data)
                  let data = res.data.data
                  this.module_menu = data.modules
                  window.sessionStorage.setItem('TPY', JSON.stringify(auth))
                  sessionStorage.module = JSON.stringify(data.modules)
                  sessionStorage.roles = JSON.stringify(data.roles)
                  this.$message.success('登录成功！')
                  this.is_login = true;
                } else if (res.data.code == 40002) {
                  this.loading = false
                  sessionStorage.removeItem('is_login');
                  this.$message({
                    showClose: true,
                    message: '用户名或密码错误！',
                    type: 'error',
                  });
                }
              }).then(() => {
                if (this.is_login == true && this.module_menu.length != 0) {
                  let redirectUrl = ''
                  // this.fetch('check_login')
                  //登录成功之后，路由跳转到用户首页（）
                  Interface.getUrl().then(res => {
                    redirectUrl = res[0].child[0].path
                    this.$router.push({
                      path: redirectUrl
                    })
                  })

                }
              })
            }
          });
        }
      },
      cancel() {

      }
    },
    created() {

    },
    mounted() {}
  }

</script>
<style scoped>
  @import './login.scss';
  @import "../../../assets/icon/iconfont.css" .el-button--primary {

    border-color: #2bb25e;
    font-size: 18px;
  }

  .el-form-item__label {
    width: 0px;
  }

  input.el-input__inner {
    background-color: #293442 !important;
  }

  .el-button--primary:hover {
    background: #69b3fc;
    border-color: #209E9E;
    color: #fff;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin-left: 10px;

  }

  .login .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #454545;
    width: 420px;
  }

  .login .form-submit .el-form .el-form-item .el-form-item__content {
    margin-left: 10px;
    height: 40px;
  }

</style>
