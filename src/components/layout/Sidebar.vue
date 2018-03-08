<template>
  <!-- <el-menu :default-active="$route.path" class="sidebar-menu" background-color="#545c64" text-color="#fff" active-text-color="#409EFF"
    unique-opened router>
    <el-menu-item index="/statistics">
      <i class="el-icon-edit-outline"></i>
      <span slot="title">数据统计</span>
    </el-menu-item>
    <el-menu-item index="/user">
      <i class="el-icon-menu"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-menu-item index="/immigrant">
      <i class="el-icon-setting"></i>
      <span slot="title">移民评估表单</span>
    </el-menu-item>
    <el-menu-item index="/country">
      <i class="el-icon-setting"></i>
      <span slot="title">国家管理</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">项目管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/project">项目列表</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/share">
      <i class="el-icon-setting"></i>
      <span slot="title">分享管理</span>
    </el-menu-item>
    <el-menu-item index="/statistics">
      <i class="el-icon-setting"></i>
      <span slot="title">数据统计</span>
    </el-menu-item>
    <el-menu-item index="/found">
      <i class="el-icon-setting"></i>
      <span slot="title">发现模块</span>
    </el-menu-item>
    <el-menu-item index="/group">
      <i class="el-icon-setting"></i>
      <span slot="title">群管理</span>
    </el-menu-item>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">权限管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/manage_group">组管理</el-menu-item>
        <el-menu-item index="/role">角色管理</el-menu-item>
        <el-menu-item index="/module">模块管理</el-menu-item>
        <el-menu-item index="/auth">用户管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span slot="title">游戏小程序管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/light-user">用户管理</el-menu-item>       
        <el-menu-item index="/light">点灯列表</el-menu-item>
         <el-menu-item index="/classifylight">点灯分类</el-menu-item>
        <el-menu-item index="/light-statistics">统计</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu> -->
  <div>
    <el-menu :unique-opened="true" :default-active="item.id.toString()" class="el-menu-vertical-demo" background-color="#545c64"
      text-color="#fff" active-text-color="#409EFF" v-for="item in menu" :key="item.id">
      <el-submenu :index="item.id.toString()" v-if="item.child">
        <template slot="title">
          <i :class="item.icon"></i>{{item.name}}</template>

        <el-submenu :index="child.id.toString()" v-for="(child,index) in item.child" v-if="child.child" :key="child.id">
          <template slot="title"><i class="el-icon-star-off"></i>{{child.name}}</template>
          <el-menu-item-group v-for="(sub,index) in child.child" :key="index">
            <el-menu-item :index="sub.id.toString()">
              <router-link :to="{path:sub.route}" class="router-default">{{sub.name}}</router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-menu-item-group v-for="(child,index) in item.child" :key="index" v-if="!child.child">
          <el-menu-item :index="item.id.toString()">
            <router-link :to="{path:child.route}" class="router-default">{{child.name}}</router-link>
          </el-menu-item>
        </el-menu-item-group>

      </el-submenu>
      <el-menu-item v-else :index="item.id.toString()">
        <i class="el-icon-setting"></i>{{item.name}}
        <!-- <router-link :to="{path:item.path}" class="router-default">{{item.name}}<router-link> -->
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  import bus from './bus.js'
  import Interface from '@/util/interface'
  export default {
    data() {
      return {
        isCollapse: true,
        menu: eval("(" + sessionStorage.getItem('module') + ")")
      }
    },
    methods: {},
    created() {
      Interface.getUrl().then(res => {
        this.menu = res
      })
    },
    mounted() {
      bus.$on('coll', msg => {
        this.isCollapse = msg
      })

    },
    watch: {},
  }

</script>
<style lang="scss">
  .sidebar-menu {
    min-height: 100vh
  }

  .side-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  .el-menu--collapse {
    width: 54px;
    min-height: 100vh;
  }

  .router-default {
    text-decoration: none;
    padding: 10px 80px 10px 8px;
    color: #fff;
  }

  .router-link-active {
    color: #409EFF;
  }

</style>
