<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="标题" prop="name">
        <el-input v-model="ruleForm.name" :disabled="show"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="nickname">
        <single-image ref="picture" @getUrl="getPicture"></single-image>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-select v-model="form.company" placeholder="请选择分类">
          <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="国家" prop="country" v-if="show">
        <el-select v-model="form.country" placeholder="请选择分类">
          <el-option v-for="item in countryOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="栏目" prop="country" v-if="show">
        <el-select v-model="form.country" placeholder="请选择分类">
          <el-option v-for="item in countryOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投资项目" prop="country" v-if="show">
        <el-select v-model="form.country" placeholder="请选择分类">
          <el-option v-for="item in countryOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词" prop="content" v-if="show">
        <el-checkbox-group v-model="tagsOptions" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in options" :label="item.title" :key="item.id">{{item.title}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="内容" prop="content" v-if="show">
        <textarea id="editor" class="cke" rows="10" cols="80"></textarea>
        <div id="chooseImg" class="modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <span>图片上传</span>
              </div>
              <div class="modal-body">
                <el-upload class="upload-demo" ref="upload" action="http://wzbs-api.qeebu.cn/upload" :on-success="handleSuccess">
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
        <el-button @click="save('ruleForm')" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  import Interface from '@/util/interface'
  import CKEDITOR from 'CKEDITOR'
  import SingleImage from '@/components/common_components/SingleImage.vue'
  export default {
    data() {
      return {
        btnDisabled: false,
        show: false,
        ruleForm: {},
        tagsOptions: [],
        companyOptions: [],
        categoryOptions: [],
        countryOptions: [],
        options: [],
        rules: {
          name: [{
            required: true,
            message: '请输入页面名',
            trigger: 'blur'
          }],
          path: [{
            required: true,
            message: '请输入页面链接',
            trigger: 'blur'
          }],
        },
      };
    },
    components: {
      SingleImage,
    },
    methods: {
      fetch() {
        Interface.getData('get', Interface.page.get + '/' + this.$route.params.id).then(res => {
          if (res.data.code == 200) {
            this.ruleForm = res.data.data
          }
        })
      },
      save(formName) {
        if (this.$route.params.id == 'add') {
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.page.post, this.ruleForm).then(res => {
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
              Interface.getData('post', Interface.page.post + '/' + this.$route.params.id, param).then(res => {
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
      getPicture(url) {
        this.form.picture = url
      }
    },
    mounted() {
      CKEDITOR.replace('editor', {
        height: '300px',
        toolbar: [{
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
          },
          {
            name: 'paragraph',
            items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
          },
          {
            name: 'tools',
            items: ['simpleupload', 'Smiley']
          },
          {
            name: 'styles',
            items: ['Styles', 'Format', 'Font', 'FontSize', 'TextColor', 'lineheight']
          },
        ],
        filebrowserImageUploadUrl: ''
      })
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
