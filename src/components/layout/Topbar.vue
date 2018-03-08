<template>
  <div class="topbar-title">
    <div>
      <div style="display:inline-block">
        <!-- <i v-if="!collapse" class="el-icon-d-arrow-left" style="float:left;font-size:35px;margin-top:15px;" @click="edit('collapse')"></i>
            <i v-if="collapse" class="el-icon-d-arrow-right" style="float:left;font-size:35px;margin-top:15px;" @click="edit('collapse')"></i> -->
        <h2 class="header">太平洋移民</h2>
      </div>
      <ol class="navbar">
        <!-- user panel -->
        <li class="user-panel">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link user">
              <img class="useravatar" src="../../assets/image/tpyLogo.jpg" alt="">
              <span class="user-name">{{userName}}</span>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="fetch('logout')" style="padding:5px 50px 5px 0">
                  <i class="icon-off"></i> 退出</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="confirm('chang_pwd')" style="padding:5px 50px 5px 0">修改密码</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ol>
      <div class="routes">
        <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
          :to="tag.path" :key="tag.path">
          {{tag.name}}
          <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
        </router-link>
      </div>
    </div>
    <div>
      <el-dialog title="修改密码" :visible="dialogFormVisible" :modal="modelStatus" :show-close="modelStatus" custom-class="passwordDialog">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入您的密码" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm_password">
            <el-input type="password" placeholder="请确认您的密码" v-model="ruleForm.confirm_password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save('submit', 'ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>

</template>
<script>
  import Interface from '@/util/interface';
  import qs from 'qs';
  import $ from 'jquery';
  import bus from './bus.js';
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else {
          callback();
        }
      };
      let validatePassAgain = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        form: {},
        isShow: false,
        dialogFormVisible: false,
        loading: false,
        ruleForm: {},
        rules:{
          password:[{required:true,message:'请输入您的新密码',trigger:'blur'}],
          confirm_password:[{required:true,message:'请请确认您的新密码',trigger:'blur'}]
        },
        userName: '',
        collapse: true,
        visitedViews1: [],
        modelStatus: false,
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.visitedViews
      }
    },
    mounted() {
      this.addViewTags()
      // document.body.appendChild(this.$refs.dialog.$el);
    },
    methods: {
      changepass() {
        this.$router.push({
          path: '/modify-password'
        })
      },
      logout() {
        this.axios.get(Interface.user.logout)
          .then(response => {
            window.sessionStorage.clear()
            this.$router.push('/login')
          })
      },
      fetch(scence, params) {
        if ('logout' == scence) {
          Interface.getData('get', Interface.user.logout).then(response => {
            if (response.data.code == 200) {
              sessionStorage.clear();
            }
          }).then(() => {
            this.$router.push('/login');
          })
        } else('')
      },
      edit(scence) {
        if ('collapse' == scence) {
          this.collapse = !this.collapse
          bus.$emit('coll', this.collapse)
          if (this.collapse) {
            bus.$emit('width', '54px')
          } else {
            bus.$emit('width', '200px')
          }
        }
      },
      confirm(scence, params) {
        if ('chang_pwd' == scence) {
          this.dialogFormVisible = true;
        }
      },
      save(scence, params) {
        if ('submit' == scence) {
          this.$refs[params].validate((valid) => {
            if (valid) {
              Interface.getData('post', Interface.user.updatePassword, this.ruleForm).then((res) => {
                if (res.data.code == 200) {
                  this.$message.success('修改成功，请重新登录！')
                  this.$router.push('/login')
                  this.dialogFormVisible = false;
                } else {
                  this.$message.error('请确认密码是否一致')

                }
              })
            }
          });
        }
      },
      //过去路由
      generateRoute() {
        if (this.$route.name) {
          return this.$route
        }
        return false
      },
      //添加标签
      addViewTags() {
        const route = this.generateRoute()
        if (!route) {
          return false
        }
        this.$store.dispatch('addVisitedViews', route)
      },
      isActive(route) {
        return route.path == this.$route.path || route.name == this.$route.name
      },
      //删除顶部标签
      closeSelectedTag(view) {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path == view.path) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        if (this.isActive(view)) {
          const latestView = this.visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      },
      delete(scence, params) {},
      back() {
        this.$router.go(-1);
      }
    },
    watch: {
      $route() {
        this.addViewTags()
      }
    },
    created() {
      let auth = JSON.parse(sessionStorage.getItem('TPY'))
      this.userName = auth.nickname;
    }
  }

</script>
<style scoped lang="scss">
  ol {
    list-style: none;
  }

  .topbar-title {
    text-align: left;
    color: #303133;
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    z-index: 100;
    box-shadow: 1px 2px 5px #eee;
    /*background-image:-webkit-linear-gradient(bottom left, #367fa9, #3c8dbc);*/
  }

  .header {
    float: left;
    text-align: left;
    color: #666;
    padding: 8px;
    margin: 0;

  }

  .avatar {
    width: 80px;
    height: 48px;
    float: left;
    margin-top: 10px;
    margin-left: 20px;
  }

  .tags-view-item {
    display: inline-block;
    position: relative;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;
    text-decoration: none;
    &:first-of-type {
      margin-left: 15px;
    }
    &.active {
      background-color: #42b983;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
  }

  .title {
    text-align: left;
    padding: 20px;
    margin: 0;
  }

  .routes {
    width: 100%;
    border-top: 1px solid #eee;
    padding: 5px 0;
    position: relative;
    overflow-x: scroll;
    white-space: nowrap;
  }

  .back {
    color: #fff;
    display: inline-block;
    margin-top: 26px;
    cursor: pointer;
  }

  .navbar {
    list-style: none;
    float: right;
    margin: 0;
  }

  .user {
    display: inline-block;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    border-radius: 0;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
  }

  .useravatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    vertical-align: middle;
  }

  .user-name {
    vertical-align: middle;
    color: #333;
  }

  .el-notification {
    top: 76px !important;
  }
  .passwordDialog {
    background: rgba(0, 0, 0, .5)
  }

</style>
