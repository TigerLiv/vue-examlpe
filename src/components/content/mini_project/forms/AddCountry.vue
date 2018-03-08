<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="135px" class="demo-ruleForm">
      <el-form-item label="国家中文名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="国家英文名称" prop="name_en">
        <el-input v-model="ruleForm.name_en"></el-input>
      </el-form-item>
      <el-form-item label="所属大洲" prop="continent">
        <el-select v-model="ruleForm.continent" placeholder="请选择所属大洲">
          <el-option label="亚洲" value="亚洲"></el-option>
          <el-option label="欧洲" value="欧洲"></el-option>
          <el-option label="大洋洲" value="大洋洲"></el-option>
          <el-option label="南极洲" value="南极洲"></el-option>
          <el-option label="北美洲" value="北美洲"></el-option>
          <el-option label="南美洲" value="南美洲"></el-option>
          <el-option label="非洲" value="非洲"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否热门" prop="hot">
        <el-radio-group v-model="ruleForm.hot">
          <el-radio :label="'1'" :key="1">是</el-radio>
          <el-radio :label="'0'" :key="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="国家图片" prop="picture">
        <image-upload @getUrl="edit('picture',$event)" ref="picture"></image-upload>
      </el-form-item>
      <el-form-item label="国旗" prop="flag_picture">
        <image-upload @getUrl="edit('flag_picture',$event)" ref="flag_picture"></image-upload>
      </el-form-item>
      <el-form-item label="国家相关内容">
        <el-radio-group v-model="style" @change="radioChange($event)">
          <el-radio v-for="item in options" :label="item.prop" :key="item.prop">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="changeStyle" prop="description">
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
      <el-form-item :label="changeStyle" prop="description" v-show="false">
        <el-input type="textarea" v-model="ruleForm.description" :autosize="{ minRows: 4}"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('ruleForm')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ImageUpload from '@/components/common_components/ImageUpload.vue'
  import Interface from '@/util/interface.js'
  import CKEDITOR from 'CKEDITOR'
  import $ from 'jquery'
  let ruleForm = {
    name: '',
    name_en: '',
    continent: '',
    flag_picture: '',
    description: '',
    live_requirement: '',
    social_welfare: '',
    educational_standards: '',
    investment: '',
    employment_environment: '',
    nationality: ''
  }
  export default {
    data() {
      return {
        options: [{
          label: '国家概况',
          prop: 'description',
        }, {
          label: '居住环境',
          prop: 'live_requirement',
        }, {
          label: '社会福利',
          prop: 'social_welfare',
        }, {
          label: '教育水平',
          prop: 'educational_standards',
        }, {
          label: '投资置业',
          prop: 'investment',
        }, {
          label: '就业环境',
          prop: 'employment_environment',
        }, {
          label: '护照国籍',
          prop: 'nationality',
        }],
        ruleForm: ruleForm,
        rules: {
          name: [{
            required: true,
            message: '请输入国家中文名',
            trigger: 'blur'
          }, ],
          name_en: [{
            required: true,
            message: '请输入国家英文名',
            trigger: 'blur'
          }, ],
          flag_picture: [{
            required: true,
            message: '请上传国家国旗',
            trigger: 'blur'
          }, ],
          picture: [{
            required: true,
            message: '请输入国家图片',
            trigger: 'blur'
          }, ],
          continent: [{
            required: true,
            message: '请选择所属大洲',
            trigger: 'change'
          }, ],
          hot: [{
            required: true,
            message: '请选择是否热门',
            trigger: 'change'
          }, ],
          description: [{
            required: true,
            message: '请输入国家概况',
            trigger: 'blur'
          }, ],
        },
        style: 'description',
        changeStyle: '国家概况'
      };
    },
    components: {
      ImageUpload,
    },
    methods: {
      save(formName) {
        this.checkString()
        if (this.$route.params.id == 'add') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              Interface.getData('post', Interface.country.post, this.ruleForm).then(res => {
                if (res.data.code == 200) {
                  this.$router.go(-1)
                  this.$message.success('添加成功')
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        } else {
          let data = this.ruleForm;
          data._method = 'PUT';
          data.status = '1';
          this.$refs[formName].validate((valid) => {
            if (valid) {
              Interface.getData('post', Interface.country.put + '/' + this.$route.params.id, data).then(res => {
                if (res.data.code == 200) {
                  this.$router.go(-1)
                  this.$message.success('修改成功')
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      },
      checkString() {
        if (this.ruleForm.description != null && this.ruleForm.description != '') {
          this.ruleForm.description = this.ruleForm.description.replace(/font-size:[/d]{1,2}px/g, 'font-size:15px')
        }
        if (this.ruleForm.live_requirement != null && this.ruleForm.live_requirement != '') {
          this.ruleForm.live_requirement = this.ruleForm.live_requirement.replace(/font-size:[/d]{1,2}px/g,
            'font-size:15px')
        }
        if (this.ruleForm.social_welfare != null && this.ruleForm.social_welfare != '') {
          this.ruleForm.social_welfare = this.ruleForm.social_welfare.replace(/font-size:[/d]{1,2}px/g,
            'font-size:15px')
        }
        if (this.ruleForm.educational_standards != null && this.ruleForm.educational_standards != '') {
          this.ruleForm.educational_standards = this.ruleForm.educational_standards.replace(/font-size:[/d]{1,2}px/g,
            'font-size:15px')
        }
        if (this.ruleForm.investment != null && this.ruleForm.investment != '') {
          this.ruleForm.investment = this.ruleForm.investment.replace(/font-size:[/d]{1,2}px/g, 'font-size:15px')
        }
        if (this.ruleForm.employment_environment != null && this.ruleForm.employment_environment != '') {
          this.ruleForm.employment_environment = this.ruleForm.employment_environment.replace(/font-size:[/d]{1,2}px/g,
            'font-size:15px')
        }
        if (this.ruleForm.nationality != null && this.ruleForm.nationality != '') {
          this.ruleForm.nationality = this.ruleForm.nationality.replace(/font-size:[/d]{1,2}px/g, 'font-size:15px')
        }
      },
      cancel(formName) {
        this.$router.go(-1)
      },
      radioChange(val) {
        this.options.forEach(item => {
          if (item.prop == val) {
            this.changeStyle = item.label
          }
        })
      },
      edit(scence, params) {
        if ('flag_picture' == scence) {
          this.ruleForm.flag_picture = params
        } else if ('picture' == scence) {
          this.ruleForm.picture = params
        }
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
      this.ckEditor = CKEDITOR.instances['editor']

      CKEDITOR.instances.editor.setData(this.ruleForm[this.style]);
      if (this.$route.params.id != 'add') {
        this.$refs.flag_picture.imageFile = [{url: ruleForm.flag_picture}]
        this.$refs.picture.imageFile = [{url: ruleForm.picture}]
      }

      CKEDITOR.instances.editor.on('instanceReady', function (e) {
        this.document.on("paste", function (e) {
          var items = e.data.$.clipboardData.items
          for (let i = 0; i < items.length; ++i) {
            let item = items[i];
            if (item.kind == 'file' && (item.type == 'image/png' || item.type == 'image/jpg')) {
              let imgFile = item.getAsFile();
              if (!imgFile) {
                return true;
              }
              let reader = new FileReader();
              console.log(reader, 'reader')
              reader.readAsDataURL(imgFile);
              reader.onload = function (e) {
                CKEDITOR.instances.editor.insertHtml('<img src="' + this.result + '"alt = ""/>');
              }
              return false;
            }
          }
        })
      })


    },
    created() {


    },
    watch: {
      style: function (newVal, oldVal) {
        if (this.ruleForm[newVal]) {
          // this.ruleForm[oldVal] = this.ruleForm.description
          // this.ruleForm.description = this.ruleForm[newVal]
          this.ruleForm[oldVal] = CKEDITOR.instances.editor.getData();
          CKEDITOR.instances.editor.setData(this.ruleForm[newVal]);
        } else {
          // this.ruleForm[oldVal] = this.ruleForm.description
          // this.ruleForm.description = ''
          this.ruleForm[oldVal] = CKEDITOR.instances.editor.getData();
          CKEDITOR.instances.editor.setData('');
        }
      },
      ruleForm: function (newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
    beforeRouteEnter: (to, from, next) => {
      if (to.params.id != 'add') {
        Interface.getData('get', Interface.country.get + '/' + to.params.id).then(res => {
          if (res.data.code == 200) {
            ruleForm = res.data.data
            ruleForm.hot = ruleForm.hot.toString()
          }
          next()
        })
        console.log('修改')
      } else {
        console.log('添加')
        ruleForm = {
          name: '',
          name_en: '',
          continent: '',
          flag_picture: '',
          description: '',
          live_requirement: '',
          social_welfare: '',
          educational_standards: '',
          investment: '',
          employment_environment: '',
          nationality: ''
        }
        next()
      }

    }
  }

</script>

<style lang="scss">
  @import '../../../../assets/css/ckUpload.css';

</style>
