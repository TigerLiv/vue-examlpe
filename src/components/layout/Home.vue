<template>
  <div class="router_view">
    <el-container>
      <el-aside width="200px" class="sidebar">
        <sidebar></sidebar>
      </el-aside>
      <el-container>
        <el-header>
          <topbar></topbar>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import sidebar from './Sidebar'
  import topbar from './Topbar'
  import router from '@/router/index'
  import Interface from '@/util/interface'
  import bus from './bus.js'
  import $ from 'jquery'
  let module_menu = []
  export default {
    data() {
      return {
        module_menu: module_menu,
        sideWidth: '',
      }
    },
    components: {
      sidebar: sidebar,
      topbar: topbar,
    },
    mounted() {
      bus.$on('width', w => {
        $('.sidebar').animate({
          width: w
        })
        this.sideWidth = w
      })
    },
    watch: {
      '$route' (to, from) {}
    },
    
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title {
    text-align: left;
    margin-left: 20px;
  }

  .topbar {
    height: 69px;
    background-color: #545c64;
    border-bottom: 1px solid #ddd;
    width: 100%;
    z-index: 10;
  }

  .sidebar {
    background-color: rgb(84, 92, 100);
    display: inline-block;
    min-height: 100vh;
  }

  .content {
    padding-top: 115px;
    margin-left: 18%;
  }

  .el-menu-vertical-demo {
    position: fixed;
    width: 18%;
  }

  .el-menu-vertical-demo {
    position: relative;
    width: 100%;
  }

  .el-header {
    padding: 0;
  }

  .el-main {
    height: calc(100vh - 115px);
    margin-top: 25px;
  }

</style>
