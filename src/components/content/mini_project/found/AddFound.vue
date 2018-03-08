<template>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-form">
      <p>基本信息</p>
      <el-form-item label="标题" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="img">
        <image-upload @getUrl="getFile" ref="imageUpload" class="createProject-upload"></image-upload>
        <span style="line-height:24px;">建议尺寸750*412</span>
      </el-form-item>
      <el-form-item label="文章简介" prop="intro">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="底部串语" prop="keyword">
        <el-input v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="文章类型" prop="type">
        <el-radio-group v-model="form.type" @change="valueChange('types',$event)">
          <el-radio :label="'0'" :key="0">自创</el-radio>
          <el-radio :label="'1'" :key="1">公众号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公众号链接" prop="url" v-show="form.type == '1'">
          <el-input v-model="url" style="width:400px"></el-input>
          <el-button type="primary" @click="edit" v-loading.fullscreen.lock="urlLoading" element-loading-text="正在解析文章,请稍后！">解析</el-button>
        </el-form-item>
      <el-form-item label="自创内容" prop="description" >
        <textarea id="editor" name="editor" class="cke" rows="10" cols="80"></textarea>
        <div id="chooseImg" class="modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <span>图片上传</span>
              </div>
              <div class="modal-body">
                <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :on-success="handleSuccess">
                  <el-button slot="trigger" size="small" type="primary" class="upload-img">选取图片</el-button>
                  <el-button size="small" type="primary" @click="Close">取消</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item>
        <!-- <div class="url-info" v-if="form.type == '1' && showUrl">
          <img :src="urlDatas.content_img" alt="" width="50px" height="50px;">
          <span class="content-title">{{urlDatas.content_title}}</span>
        </div> -->
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
  let form = {
    type: '0',
  }
  export default {
    data() {
      return {
        uploadUrl: AxiosConfig.baseURL + Interface.image.upload,
        btnDisabled: false,
        form: form,
        rules: {
          name: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
          img: [{
            required: true,
            message: '请上传封面',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入文章详情',
            trigger: 'blur'
          }],
        },
        urlLoading: false,
        urlDatas: {},
        showUrl: false,
        url: '',
        publicContent:''
      };
    },
    components: {
      'imageUpload': ImageUpload
    },
    methods: {
      edit() {
        this.urlLoading = true
        let params = {
          url: this.url,
          need_content: 1
        }
        Interface.getData('get', Interface.found.get_content, params).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data
            this.urlDatas = data
            this.urlLoading = false
            this.showUrl = true
            this.$set(this.form, 'name', data.content_title)
            this.form.img = data.content_img
            
            this.publicContent = data.content
            this.$refs['imageUpload'].imageFile = [{ url: data.content_img }]
            CKEDITOR.instances['editor'].setData(data.content)
            this.$message.success('解析成功')
          } else {
            this.$message.error('解析失败')
            this.urlLoading = false
          }
        })
      },
      valueChange(scence, val) {
        if ('types' == scence) {

        }
      },
      Close() {
        document.getElementById('chooseImg').style.display = 'none'
      },
      handleSuccess(res) {
        document.getElementById('chooseImg').style.display = 'none'
        CKEDITOR.instances.editor.insertHtml("<img src='" + res.data.path + "' />")
      },
      save(formName) {
        if (this.$route.params.id == 'add') {
          if (this.form.type == '0') {
            this.form.description = CKEDITOR.instances['editor'].getData()
          } else {
            this.form.description = this.publicContent
          }
          let params = this.form
          params.url = this.url
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.found.post, params).then(res => {
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
          if (this.form.type == '0') {
            this.form.description = CKEDITOR.instances['editor'].getData()
          }
          let param = this.form
          param.url = this.url
          param._method = 'put'
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.found.post + '/' + this.$route.params.id, param).then(res => {
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
      getFile(url) {
        this.form.img = url
      },
    },
    mounted() {
      CKEDITOR.replace('editor',
        {
          height: '300px',
          toolbar: [
            {
              name: 'basicstyles',
              items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            },
            { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
            { name: 'tools', items: ['simpleupload', 'Smiley'] }
          ],
          filebrowserImageUploadUrl: ''
        })
      // if (this.form.type == '0') {
        
      // }
      if(this.$route.params.id != 'add'){ //修改文章
        this.$refs['imageUpload'].imageFile = [{ url: form.img }]
        CKEDITOR.instances['editor'].setData(form.description)
        this.url = form.url
      }
    },
    created() {
      this.urlDatas = form
    },
    beforeRouteEnter: (to, from, next) => {
      // ...
      if (to.params.id != 'add') {
        Interface.getData('get', `${Interface.found.get}/${to.params.id}`).then(res => {
          if (res.data.code == 200) {
            form.type = res.data.data.type.toString()
            form = res.data.data
          }
          next()
        })
      } else {
        form = {
          type: '0',
        }
        next()
      }

    }
  }

</script>
<style>
  @import '../../../../assets/css/container.css';
  @import '../../../../assets/css/ckUpload.css';
  .createProject-upload {
    height:158px;
  }
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