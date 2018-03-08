<template>
  <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-form-item label="灯类型" prop="name">
      <el-select v-model="name" placeholder="请选择灯类型">
        <el-option v-for="item in lightData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联国家" prop="country">
      <el-select v-model="country" multiple placeholder="请选择关联国家" @change="valueChange('country')">
        <el-option v-for="item in lightCountry" :key="item.id" :label="item.title" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联移民目的" multiple prop="purpose">
      <el-select v-model="purpose" multiple placeholder="请选择关联移民目的" @change="valueChange('purpose')">
        <el-option v-for="item in lightPurpose" :key="item.id" :label="item.title" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="内容详情" prop="desc">
      <el-input type="textarea" @change="sensitive" v-model="desc"></el-input>
      <p style="color:red;font-size:13px;" v-if="sensitive_show">你的内容详情中存在敏感词，请重新输入</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()" :disabled="sensitive_show">保存</el-button>
      <el-button @click="resetForm()">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import Interface from '@/util/interface.js'
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
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
    methods: {
      fetch() {
        //获取数据
        Interface.getData('get', Interface.light.get + '/' + this.id).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            this.name = data.name;
            console.log(data, 'aa')
            data.attr.country_data.forEach(val => {
              this.country.push(val.title)
            })
            data.attr.immigrant_data.forEach(val => {
              this.purpose.push(val.title)
            })
            this.desc = data.attr.light_desc;
          }

        })
        // 获取灯名
        Interface.getData('get', Interface.light.get).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data
            this.lightData = data;
          }
        })
        //获取国家
        let params = {
          identify: 'immigrant'
        }
        Interface.getData('get', Interface.form.get_front, params).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data.questions;
            data.forEach(val => {
              if (val.annotation == '意向国家') {
                this.lightCountry = val.selects;
              }
              if (val.annotation == '移民目的') {
                this.lightPurpose = val.selects;
              }
            })
          }
        })

      },
      valueChange(scene) {

      },
      sensitive(val){
        let params={
          str:val
        }
        Interface.getData('post',Interface.website.sensitiveWord.check,params).then(res=>{
          if (res.data.code!=200) {
            this.sensitive_show=true
          }else{
            this.sensitive_show=false
          }
        })
      },
      submitForm(formName) {
        var countrys = this.lightCountry;
        var purposes = this.lightPurpose;
        //国家

        this.country.forEach(val => {
          var cid = val;
          console.log(cid)
          countrys.forEach(val => {
            if (val.id == cid) {
              let params = {
                id: val.id,
                title: val.title
              }
              this.country_data.push(params);
            } else if (cid == val.title) {
              let params = {
                id: val.id,
                title: val.title
              }
              this.country_data.push(params);
            }

          })
        })
        //移民目的
        this.purpose.forEach(val => {
          var cid = val;
          purposes.forEach(val => {
            if (val.id == cid) {
              let params = {
                id: val.id,
                title: val.title
              }
              this.immigrant_data.push(params);
            } else if (cid == val.title) {
              let params = {
                id: val.id,
                title: val.title
              }
              this.immigrant_data.push(params);
            }
          })
        })

        let params = {
          light_id: this.id,
          country_data: JSON.stringify(this.country_data),
          immigrant_data: JSON.stringify(this.immigrant_data),
          light_desc: this.desc
        }
        var self = this;
        this.$confirm('确定提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Interface.getData('post', Interface.light.post, params).then(res => {
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

</style>
