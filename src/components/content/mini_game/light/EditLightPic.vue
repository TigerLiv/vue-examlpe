<template>
  <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-form-item label="灯类型" prop="name">
      <el-input placeholder="请输入内容" v-model="ruleForm.name" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="背景图" prop="country">
        <el-input v-model="ruleForm.picture" auto-complete="off" v-show="false"></el-input>
        <single-image ref="picture" @getUrl="getPicture"></single-image>
    </el-form-item>
    <el-form-item label="tab未选中"  prop="tab_unchecked">
        <el-input v-model="ruleForm.tab_unchecked" auto-complete="off" v-show="false"></el-input>
        <single-image ref="tab_unchecked" @getUrl="getTabUnchecked"></single-image>
    </el-form-item>
    <el-form-item label="tab选中" prop="tab_checked">
         <el-input v-model="ruleForm.tab_checked" auto-complete="off" v-show="false"></el-input>
        <single-image ref="tab_checked" @getUrl="getTabChecked"></single-image>
    </el-form-item>
    <el-form-item label="点灯许愿图" prop="picture_light">
        <el-input v-model="ruleForm.picture_light" auto-complete="off" v-show="false"></el-input>
        <single-image ref="picture_light" @getUrl="getPicLight"></single-image>
    </el-form-item>
    <el-form-item label="排行榜列表图" prop="picture_list">
        <el-input v-model="ruleForm.picture_list" auto-complete="off" v-show="false"></el-input>
        <single-image ref="picture_list" @getUrl="getList"></single-image>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()" :disabled="sensitive_show">保存</el-button>
      <el-button @click="resetForm()">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import Interface from '@/util/interface.js'
  import SingleImage from "@/components/common_components/SingleImage.vue";
  export default {
    data() {
      return {
        ruleForm: {
          
        },
        rules: {
          desc: [{
            message: '请输入内容详情',
            trigger: 'blur'
          }],
        },
        options: {},
        // id:this.$router.params.id,
        lightData: [],
        lightCountry: [],
        lightPurpose: [],
        name: '',
        country: [],
        purpose: [],
        desc: '',
        id: this.$route.params.id,
        country_data: [],
        immigrant_data: [],
        sensitive_show:false
      }
    },
    components: {
        SingleImage,
     },
    methods: {
      fetch() {
        //获取数据
        Interface.getData('get', Interface.light.get+'/'+this.id).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            this.ruleForm=data;
            this.$refs.picture.imageUrl = data.picture;
            this.$refs.tab_unchecked.imageUrl = data.tab_unchecked;
            this.$refs.tab_checked.imageUrl = data.tab_checked;
            this.$refs.picture_light.imageUrl = data.picture_light;
            this.$refs.picture_list.imageUrl = data.picture_list;
            
          }
        })

      },
      submitForm(formName) {
        let param = this.ruleForm;
        param._method='_put';
        var self = this;
        this.$confirm('确定提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Interface.getData('post', Interface.light.post+'/'+this.$route.params.id, param).then(res => {
            if (res.data.code == 200) {
              self.$message.success('提交成功！')
              self.$router.push({
                path: '/light'
              })
            } else {
              self.$message.warning('提交失败！');
            }
          })
        })
      },
      resetForm(formName) {
        this.$router.push({
          path: '/light'
        })
      },
      getPicture(url) {
        this.ruleForm.picture = url;
      },
      getTabUnchecked(url){
          this.ruleForm.tab_unchecked=url;
      },
      getTabChecked(url){
          this.ruleForm.tab_checked=url;
      },
      getPicLight(url){
          this.ruleForm.picture_light=url;
      },
      getList(url){
          this.ruleForm.picture_list=url;
      }

    },
    created() {
      this.fetch();
    }
  }

</script>
<style scoped>
  .el-textarea {
    width: 600px;
  }
  .el-input{
      width: 300px !important;
  }

</style>
