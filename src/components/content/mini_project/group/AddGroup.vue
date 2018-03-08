<template>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="130px" class="demo-form">
      <el-form-item label="群名称" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="群类型" prop="category">
        <el-select v-model="form.category" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="群主名称" prop="master_name">
        <el-input v-model="form.master_name"></el-input>
      </el-form-item>
      <el-form-item label="群标记" prop="identify">
        <el-input v-model="form.identify"></el-input>
      </el-form-item>
      <el-form-item label="群图片" prop="picture">
        <image-upload @getUrl="getImage" ref="image" class="createProject-upload"></image-upload>
      </el-form-item>
      <el-form-item label="群主二维码" prop="qr_url">
        <image-upload @getUrl="getFile" ref="qrImage" class="createProject-upload"></image-upload>
      </el-form-item>
      <el-form-item label="是否设置为热门" prop="is_hot">
        <el-radio-group v-model="form.is_hot">
          <el-radio :label="'1'" :key="1">是</el-radio>
          <el-radio :label="'0'" :key="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否上架" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="'1'" :key="1">是</el-radio>
          <el-radio :label="'0'" :key="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="save('form')" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  import CKEDITOR from 'CKEDITOR'
  import AxiosConfig from '@/util/axios-config';
  import ImageUpload from '@/components/common_components/ImageUpload.vue';
  import Interface from '@/util/interface'
  export default {
    data() {
      return {
        uploadUrl: AxiosConfig.baseURL + Interface.image.upload,
        btnDisabled: false,
        form: {
          is_host:'',
          status:''
        },
        rules: {
          title: [{
            required: true,
            message: '请输入群名称',
            trigger: 'blur'
          }],
          category: [{
            required: true,
            message: '请输入群类型',
            trigger: 'change'
          }],
          master_name: [{
            required: true,
            message: '请输入群主名称',
            trigger: 'blur'
          }],
          identify: [{
            required: true,
            message: '请输入群标识',
            trigger: 'blur'
          }],
          qr_url: [{
            required: true,
            message: '请上传群二维码',
            trigger: 'blur'
          }],
          is_hot: [{
            required: true,
            message: '请选择是否热门',
            trigger: 'change'
          }],
          status: [{
            required: true,
            message: '请选择是否上架',
            trigger: 'change'
          }],
        },
        urlLoading: false,
        options:[]
      };
    },
    components: {
      'imageUpload': ImageUpload
    },
    methods: {
      fetch(scence) {
        if('category' == scence) {
          Interface.getData('get',Interface.wx_group.category).then(res => {
            if(res.data.code == 200) {
              let data = res.data.data
              this.options = data
            }
          })
        } else if('detail' == scence) {
          Interface.getData('get',`${Interface.wx_group.get}/${this.$route.params.id}`).then(res => {
            if(res.data.code == 200){
              this.form = res.data.data
              this.form.is_hot = res.data.data.is_hot.toString()
              this.form.status = res.data.data.status.toString()
              this.$refs['qrImage'].imageFile = [{ url: this.form.qr_url }]
              this.$refs['image'].imageFile = [{ url: this.form.picture }]
            }
          })
        }
      },
      save(formName) {
        if (this.$route.params.id == 'add') {
          let params = this.form
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.wx_group.post, params).then(res => {
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
          let param = this.form
          param._method = 'put'
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.wx_group.post + '/' + this.$route.params.id, param).then(res => {
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
      },
      getImage(url) {
        this.form.picture = url
      },
      getFile(url) {
        this.form.qr_url = url
      },
    },
    mounted() {
      
    },
    created() {
      this.fetch('category')
      if(this.$route.params.id != 'add'){
        this.fetch('detail')
      }
    },
  }

</script>
<style>
  @import '../../../../assets/css/container.css';
  @import '../../../../assets/css/ckUpload.css';
  .el-radio+.el-radio {
    margin-left: 0 !important;
  }

  .el-radio {
    margin-right: 30px;
    margin-top: 10px;
  }

  .url-info {
    margin-top: 15px;
    border: 1px solid #eee;
    position: relative;
    width: 80%;
    height: 50px;
  }

  .content-title {
    display: inline-block;
    position: relative;
    top: -18px;
  }
</style>