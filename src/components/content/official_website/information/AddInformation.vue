<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="案例类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
              <el-radio :label="'0'" :key="0">成功案例</el-radio>
              <el-radio :label="'1'" :key="1">头条新闻</el-radio>
              <el-radio :label="'2'" :key="2">移民资讯</el-radio>
            </el-radio-group>
      </el-form-item>
      <el-form-item label="标题" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="ruleForm.author"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="cover">
        <single-image ref="picture" @getUrl="getPicture"></single-image>
      </el-form-item>
      <el-form-item label="公司" prop="company_id">
        <el-select v-model="ruleForm.company_id" placeholder="请选择公司">
          <el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id.toString()">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="category_id">
        <el-select v-model="categories" multiple placeholder="请选择类型" @change="valueChange('category',$event)" style="width:60%">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.title" :value="item.id.toString()">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间" prop="publish_time">
        <el-date-picker v-model="ruleForm.publish_time" type="datetime" placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input v-model="ruleForm.source"></el-input>
      </el-form-item>
      <!-- <el-form-item label="点赞数" prop="like_count">
        <el-input v-model="ruleForm.like_count"></el-input>
      </el-form-item> -->
      <el-form-item label="关键词" prop="keywords">
        <el-input v-model="ruleForm.keywords" placeholder="多个关键词以英文逗号进行分隔"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-input v-model="ruleForm.tags" placeholder="多个标签以英文逗号进行分隔"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="intro">
        <el-input type="textarea" v-model="ruleForm.intro" :rows="4"></el-input>
      </el-form-item>
      <!-- <el-form-item label="国家" prop="country" v-if="show">
          <el-select v-model="ruleForm.country" placeholder="请选择分类">
            <el-option v-for="item in countryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词" prop="content" v-if="show">
          <el-checkbox-group v-model="tagsOptions" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in options" :label="item.title" :key="item.id">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      <el-form-item label="内容" prop="description">
        <textarea id="editor" name="editor" class="cke" rows="10" cols="80"></textarea>
        <div id="chooseImg" class="modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <span>图片上传</span>
              </div>
              <div class="modal-body">
                <el-upload class="upload-demo" ref="upload" action="https://api.dkjt.qeebu.com/upload" :on-success="handleSuccess">
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
  import CKEDITOR from 'CKEDITOR';
  import SingleImage from '@/components/common_components/SingleImage.vue'
  let ruleForm = {}
  export default {
    data() {
      return {
        btnDisabled: false,
        show: false,
        ruleForm: ruleForm,
        tagsOptions: [],
        companyOptions: [],
        categoryOptions: [],
        countryOptions: [],
        options: [],
        categories: [],
        rules: {
          type: [{
            required: true,
            message: '请选择案例类型',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
          author: [{
            required: true,
            message: '请输入作者',
            trigger: 'blur'
          }],
          cover: [{
            required: true,
            message: '请上传活动图片',
            trigger: 'blur'
          }],
          company_id: [{
            required: true,
            message: '请选择公司',
            trigger: 'change'
          }],
          category_id: [{
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }],
          publish_time: [{
            required: true,
            message: '请选择发布时间',
            trigger: 'change'
          }],
          source: [{
            required: true,
            message: '请输入来源',
            trigger: 'blur'
          }],
          keywords: [{
            required: true,
            message: '请输入关键词',
            trigger: 'blur'
          }],
          tags: [{
            required: true,
            message: '请输入标签',
            trigger: 'blur'
          }],
          intro: [{
            required: true,
            message: '请输入摘要',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }],
        },
      };
    },
    components: {
      SingleImage,
    },
    methods: {
      fetch(scence) {
        if ('category' == scence) {
          Interface.getData('get', Interface.project.category).then(res => {
            if (res.data.code == 200) {
              this.categoryOptions = res.data.data
            }
          }).then(() => {
            Interface.getData('get', Interface.website.company.get).then(res => {
              if (res.data.code == 200) {
                this.companyOptions = res.data.data
              }
            })
          })
        }

      },
      save(formName) {
        if (this.$route.params.id == 'add') {
          this.ruleForm.publish_time = new Date(this.ruleForm.publish_time).getTime() / 1000
          this.ruleForm.description = CKEDITOR.instances['editor'].getData()
          let params = this.ruleForm
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.case.post, params).then(res => {
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
          this.ruleForm.publish_time = new Date(this.ruleForm.publish_time).getTime() / 1000
          this.ruleForm.description = CKEDITOR.instances['editor'].getData()
          let param = this.ruleForm
          param._method = 'PUT'
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.case.post + '/' + this.$route.params.id, param).then(
                res => {
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
      valueChange(scence, params) {
        if ('category' == scence) {
          let tops = ''
          params.forEach((val, index) => {
            tops += val
            if (index < params.length - 1) {
              tops += ','
            }
          })
          this.ids = tops
          this.ruleForm.category_id = tops
        }
      },
      getPicture(url) {
        this.ruleForm.cover = url
      },
      handleSuccess(res) {
        document.getElementById('chooseImg').style.display = 'none'
        CKEDITOR.instances.editor.insertHtml("<img src='" + res.data.path + "' />")
      },
      Close() {
        document.getElementById('chooseImg').style.display = 'none'
      },
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
      CKEDITOR.instances['editor'].setData(ruleForm.description)
      if (this.$route.params.id != 'add') {
        this.$refs.picture.imageUrl = ruleForm.cover;
        this.categories = ruleForm.category_id.split(',')
      }
    },
    created() {
      this.fetch('category')
    },
    beforeRouteEnter: (to, from, next) => {
      if (to.params.id != 'add') {
        Interface.getData('get', `${Interface.website.case.get}/${to.params.id}`).then(res => {
          if (res.data.code == 200) {
            ruleForm = res.data.data
            ruleForm.type = ruleForm.type.toString()
            ruleForm.publish_time = Interface.getTime(res.data.data.publish_time)
          }
          next()
        })
      } else {
        ruleForm = {}
        next()
      }
    }
  }

</script>
<style scoped>
  @import '../../../../assets/css/container.css';
  @import '../../../../assets/css/ckUpload.css';

</style>
