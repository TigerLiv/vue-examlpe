<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="页面名称" prop="name">
        <el-input v-model="ruleForm.name" :disabled="show"></el-input>
      </el-form-item>
      <el-form-item label="页面链接" prop="link">
        <el-input v-model="ruleForm.link" :disabled="show"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="html">
        <el-input type="textarea" v-model="ruleForm.html" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="属于" prop="belong">
        <el-input v-model="ruleForm.belong" :disabled="show"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="save('ruleForm')" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  import Interface from '@/util/interface'
  export default {
    data() {
      return {
        btnDisabled: false,
        show: false,
        ruleForm: {},
        rules: {
          name: [{
            required: true,
            message: '请输入页面名',
            trigger: 'blur'
          }],link: [{
            required: true,
            message: '请输入页面链接',
            trigger: 'blur'
          }],html: [{
            required: true,
            message: '请输入页面代码',
            trigger: 'blur'
          }],belong: [{
            required: true,
            message: '请输入页面属于',
            trigger: 'blur'
          }],
        },
      };
    },
    methods: {
      fetch() {
        Interface.getData('get', Interface.website.frontend.get + '/' + this.$route.params.id).then(res => {
          if (res.data.code == 200) {
            this.ruleForm = res.data.data
          }
        })
      },
      save(formName) {
        if (this.$route.params.id == 'add') {
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.frontend.get, this.ruleForm).then(res => {
                if (res.data.code == 200) {
                  this.$message.success('添加成功！')
                  this.$router.go(-1)
                } else {
                  this.$message.error('添加失败！')
                }
              })
            } else {
              console.log('error')
            }
          })
        } else {
          let param = this.ruleForm
          param._method = 'PUT'
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.frontend.get + '/' + this.$route.params.id, param).then(res => {
                if (res.data.code == 200) {
                  this.$message.success('修改成功！')
                  this.$router.go(-1)
                } else {
                  this.$message.error('修改失败！')
                }
              })
            } else {
              console.log('error')
            }
          })
        }

      },
      cancel() {
        this.$router.go(-1)
      }
    },
    mounted() {

    },
    created() {
      console.log(this.$route.params.id)
      if (this.$route.params.id != 'add') {
        this.fetch()
        this.show = true
      } else {
        this.show = false
      }
    }
  }

</script>
<style scoped>
  @import '../../../../assets/css/container.css';

</style>
