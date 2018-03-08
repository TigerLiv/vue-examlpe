<template>
  <div class="container" v-loading="loading" element-loading-text="正在提交，请稍后！">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="project-form">
      <el-form-item label="项目名称" prop="title">
        <el-input v-model="form.title" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="项目简介" prop="intro">
        <el-input v-model="form.intro" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="项目封面" prop="picture">
        <el-input v-model="form.picture" v-show="false"></el-input>
        <single-image ref="singleImage" @getUrl="edit('singleImage',$event)"></single-image>
      </el-form-item>
      <el-form-item label="项目图片" prop="projectImages">
        <el-input v-model="form.projectImages" v-show="false"></el-input>
        <picture-upload ref="pictureUpload" @getUrl="edit('pictureUpload',$event)" @removeImage="edit('removePicture',$event)"></picture-upload>
      </el-form-item>
      <el-form-item label="所属国家" prop="country_id">
        <el-select v-model="form.country_id" placeholder="请选择" @change="valueChange('country',$event)">
          <el-option v-for="item in countryOptions" :key="parseInt(item.id)" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型" prop="category">
        <el-select v-model="form.category" placeholder="请选择" @change="valueChange('category',$event)">
          <el-option v-for="item in categoryOptions" :key="parseInt(item.id)" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否热门搜索" prop="hot_search">
        <el-radio-group v-model="form.hot_search">
          <el-radio :label="'1'" :key="1">是</el-radio>
          <el-radio :label="'0'" :key="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否热门项目" prop="is_hot">
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
      <el-form-item label="是否主推" prop="main_push">
        <el-radio-group v-model="form.main_push">
          <el-radio :label="'1'" :key="1">是</el-radio>
          <el-radio :label="'0'" :key="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="签证类型" prop="visa_type">
        <el-select v-model="form.visa_type" placeholder="请选择" @change="valueChange('country',$event)">
          <el-option v-for="item in visaOptions" :key="parseInt(item.id)" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐指数" prop="recommended">
        <el-input-number v-model="form.recommended" :min="1" :max="5" label="推荐指数"></el-input-number>
      </el-form-item>
      <el-form-item label="投资金额" prop="investments">
        <el-input v-model="form.investments" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="附属人申请条件" prop="attached_apply_condition">
        <el-input v-model="form.attached_apply_condition" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="续签条件" prop="renew_condition">
        <el-input v-model="form.renew_condition" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="永居条件" prop="forever_live_condition">
        <el-input v-model="form.forever_live_condition" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="入籍条件" prop="naturalization_condition">
        <el-input v-model="form.naturalization_condition" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="费用预估" prop="estimated_amounts">
        <el-input v-model="form.estimated_amounts" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="申请费用" prop="apply_expenses">
        <el-input v-model="form.apply_expenses" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="流程周期" prop="handle_procedure_period">
        <el-input v-model="form.handle_procedure_period" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="类目选择">
        <el-radio-group v-model="annotationId" @change="valueChange('annotation',$event)">
          <el-radio v-for="(item,index) in options" :label="item.id" :key="parseInt(item.id)">{{item.annotation}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="annotationName" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }">
        <el-select v-model="selectValue" placeholder="请选择" v-show="annotationName !='移民目的'" @change="valueChange('single',$event)">
          <el-option v-for="item in selectOptions" :key="parseInt(item.id)" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="multipleValue" multiple placeholder="请选择" v-show="annotationName =='移民目的'" style="width:320px" @change="valueChange('multiple',$event)"
          @remove-tag="clear">
          <el-option v-for="item in selectOptions" :key="parseInt(item.id)" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公众号链接" prop="url">
        <el-input v-model="url" style="width:400px"></el-input>
        <el-button type="primary" @click="edit('public')" v-loading.fullscreen.lock="urlLoading" element-loading-text="正在解析文章,请稍后！">解析</el-button>
      </el-form-item>
      <el-form-item label="公众号详情" prop="introduce_public">
        <el-input type="textarea" v-model="form.introduce_public" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="项目相关内容">
        <el-radio-group v-model="types" @change="valueChange('types',$event)">
          <el-radio v-for="item in projectOptions" :label="item.prop" :key="item.prop">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="changeName" prop="introduce">
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
      <el-form-item label="项目流程">
        <el-button type="text" @click="add" class="add_select">添加流程</el-button>
      </el-form-item>
      <el-form-item v-for="(item,index) in form.web_handle_procedure" :label="'步骤' + index" :key="item.key" :prop="'web_handle_procedure.' + index + '.content'"
        :rules="{required: true, message: '步骤不能为空', trigger: 'blur'}">
        <el-input v-model="item.content" placeholder="输入流程" style="width:200px;"></el-input>
        <el-button @click.prevent="removeDomain(item)">删除</el-button>
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
  import Interface from '@/util/interface'
  import SingleImage from '@/components/common_components/SingleImage.vue'
  import PictureUpload from '@/components/common_components/PictureUpload.vue'
  let form = {
    title: '',
    intro: '',
    introduce: '',
    advantage: '',
    apply_condition: '',
    handle_procedure: '',
    attr: ''
  }
  export default {
    data() {
      return {
        btnDisabled: false,
        form: {
          web_handle_procedure: [{
            id: 0,
            content: '',
          }],
        },
        rules: {
          title: [{
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          }],
          intro: [{
            required: true,
            message: '请输入项目简介',
            trigger: 'blur'
          }],
          introduce: [{
            required: true,
            message: '请输入项目介绍',
            trigger: 'blur'
          }],
          picture: [{
            required: true,
            message: '请上传项目封面',
            trigger: 'change'
          }],
          projectImages: [{
            required: true,
            message: '请上传项目图片',
            trigger: 'blur'
          }],
          country_id: [{
            required: true,
            message: '请选择所属国家',
            trigger: 'change'
          }],
          category: [{
            required: true,
            message: '请选择项目类型',
            trigger: 'change'
          }],
          hot_search: [{
            required: true,
            message: '请设置项目是否为热门',
            trigger: 'change'
          }],
          is_hot: [{
            required: true,
            message: '请设置项目是否为热门',
            trigger: 'change'
          }],
          status: [{
            required: true,
            message: '请设置项目是否上架',
            trigger: 'change'
          }],
          main_push: [{
            required: true,
            message: '请设置是否主推项目',
            trigger: 'change'
          }],
          visa_type: [{
            required: true,
            message: '请选择签证类型',
            trigger: 'change'
          }],
          investments: [{
            required: true,
            message: '请输入投资金额',
            trigger: 'blur'
          }],
          attached_apply_condition: [{
            required: true,
            message: '请输入附属人申请条件',
            trigger: 'blur'
          }],
          renew_condition: [{
            required: true,
            message: '请输入续签条件',
            trigger: 'blur'
          }],
          forever_live_condition: [{
            required: true,
            message: '请输入永居条件',
            trigger: 'blur'
          }],
          naturalization_condition: [{
            required: true,
            message: '请输入入籍条件',
            trigger: 'blur'
          }],
          estimated_amounts: [{
            required: true,
            message: '请输入费用预估',
            trigger: 'blur'
          }],
          apply_expenses: [{
            required: true,
            message: '请输入申请费用',
            trigger: 'blur'
          }],
          handle_procedure_period: [{
            required: true,
            message: '请输入流程周期',
            trigger: 'blur'
          }],
          recommended: [{
            required: true,
            message: '请输入推荐指数',
            trigger: 'change'
          }],
        },
        options: [],
        selectOptions: [],
        projectOptions: [{
          label: '项目介绍',
          prop: 'introduce',
        }, {
          label: '项目优势',
          prop: 'advantage',
        }, {
          label: '申请条件',
          prop: 'apply_condition',
        }, {
          label: '办理流程',
          prop: 'handle_procedure',
        }],
        types: 'introduce',
        changeName: '项目介绍',
        annotationId: '',
        annotationName: '',
        selectValue: '',
        multipleValue: [],
        form_id: '',
        loading: false,
        countryOptions: [], //国家列表
        categoryOptions: [], //项目类型
        visaOptions: [], //签证类型
        attr: [],
        projectImages: [],
        url: '',
        urlLoading: false,
        index: 0
      };
    },
    components: {
      SingleImage,
      PictureUpload
    },
    methods: {
      fetch(scence) {
        if ('list' == scence) {
          Interface.getData('get', Interface.form.get_front, {
            identify: 'immigrant'
          }).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data.questions
              data.map(element => {
                element.checkedArr = [];
                element.selects.push({
                  id: 0,
                  title: '无要求'
                })
              })
              this.options = data
              //给定一个默认的类目选择
              this.selectOptions = data[0].selects
              this.annotationId = data[0].id
              this.annotationName = data[0].annotation
              data.forEach(val => {
                this.form_id = val.form_id
              })
            }
          }).then(() => {
            if (this.$route.params.id != 'add') {
              form.attr.forEach(elem => {
                if (elem.question_id == this.annotationId) {
                  this.selectValue = elem.question_answer[0]
                }
              })
            }
          })
        } else if ('country' == scence) { //国家
          Interface.getData('get', Interface.project.country).then(res => {
            if (res.data.code == 200) {
              this.countryOptions = res.data.data
            }
          })
        } else if ('category' == scence) { //项目类型
          Interface.getData('get', Interface.project.category).then(res => {
            if (res.data.code == 200) {
              this.categoryOptions = res.data.data
            }
          })
        } else if ('visa' == scence) { //签证类型
          Interface.getData('get', Interface.website.visa.get).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data
              this.visaOptions = data;
            }
          })
        }

      },
      valueChange(scence, val) {
        if ('types' == scence) {
          this.projectOptions.forEach(item => {
            if (item.prop == val) {
              this.changeName = item.label
            }
          })
        } else if ('annotation' == scence) {
          this.options.forEach((elem, index) => {
            if (elem.id == val) {
              this.selectOptions = elem.selects
              this.annotationName = elem.annotation
              if (this.options[index].checkedArr.length == 0) {
                this.selectValue = ''
                this.multipleValue = []
              }
            }
          })
        } else if ('single' == scence) { //类目选择除移民目的之外的类目
          this.options.map((element, index) => {
            if (element.id == this.annotationId) {
              this.options[index].checkedArr.push(this.selectValue);
            } else {

            }
          })
          if (this.attr.length && this.attr.length == 0) {
            this.attr.push({
              question_id: this.annotationId,
              question_answer: [this.selectValue]
            })
          } else {
            if (this.attr.some((element) => {
                return element.question_id == this.annotationId;
              })) {
              this.attr.map((element, index) => {
                if (element.question_id == this.annotationId) {
                  this.attr.splice(index, 1, {
                    question_id: this.annotationId,
                    question_answer: [this.selectValue]
                  })
                }
              })
            } else {
              this.attr.push({
                question_id: this.annotationId,
                question_answer: [this.selectValue]
              })
            }
          }
        } else if ('multiple' == scence) { //移民目的多选
          this.options.map((element, index) => {
            if (element.id == this.annotationId) {
              this.options[index].checkedArr = this.multipleValue;
            }
          })
          if (this.attr.some((elem) => {
              return elem.question_id == this.annotationId;
            })) {
            this.attr.map((element, index) => {
              if (element.question_id == this.annotationId) {
                this.attr.splice(index, 1, {
                  question_id: this.annotationId,
                  question_answer: this.multipleValue
                })
              }
            })
          } else {
            this.attr.push({
              question_id: this.annotationId,
              question_answer: this.multipleValue
            })
          }
        }
      },
      edit(scence, params) {
        if ('public' == scence) {
          this.urlLoading = true
          let params = {
            url: this.url,
            need_content: 1
          }
          Interface.getData('get', Interface.found.get_content, params).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data
              this.urlLoading = false
              this.$refs.singleImage.imageUrl = data.content_img
              this.form.introduce_public = data.content
              this.$message.success('解析成功')
            } else {
              this.$message.error('解析失败')
              this.urlLoading = false
            }
          })
          //上传项目封面
        } else if ('singleImage' == scence) {
          this.$set(this.form, 'picture', params)
          this.form.picture = params
          //上传项目图片
        } else if ('pictureUpload' == scence) {
          this.projectImages = []
          this.$set(this.form, 'projectImages', params[0].url)
          params.forEach((val, index) => {
            if (val.response) {
              this.projectImages.push({
                id: index + 1,
                url: val.response.data.path
              })
            } else {
              this.projectImages.push({
                id: val.id,
                url: val.url
              })
            }
          })
          console.log(this.projectImages)
        } else if ('removePicture' == scence) {
          this.projectImages = params
        }

      },
      clear(params) {
        // this.options.map((element, index) => {
        //     if (element.id == this.annotationId) {
        //         this.options[index].checkedArr = this.multipleValue;
        //         this.attr.splice(index, 1, { question_id: this.annotationId, question_answer: this.multipleValue })
        //     }
        // })
      },
      add() {
        this.index += 1
        console.log(this.form.web_handle_procedure)
        this.form.web_handle_procedure.push({
          id: this.index,
          content: '',
        });
      },
      removeDomain(item) {
        var index = this.form.web_handle_procedure.indexOf(item)
        if (index !== -1) {
          this.form.web_handle_procedure.splice(index, 1)
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
        this.checkString()
        let string = ''
        this.attr.forEach((elem, index) => { //类目选择
          string += JSON.stringify(elem)
          if (index < this.attr.length - 1) {
            string += ','
          }
        })
        let images = []
        this.projectImages.forEach((val, index) => { //项目图片
          images.push({
            id: val.id,
            url: val.url
          })
        })
        let form = Interface.cloneObj(this.form)
        if (this.$route.params.id == 'add') {
          if (this.projectImages.length < 4) {
            this.$message.error('上传项目图片不能少于4张！')
          } else {
            console.log(JSON.stringify(this.form.web_handle_procedure))
            params.attr = `[${string}]`
            params.form_id = this.form_id
            params.images = JSON.stringify(images)
            params.web_handle_procedure = JSON.stringify(form.web_handle_procedure)
            if (this.form.advantage != '' || this.form.apply_condition != '' || this.form.handle_procedure != '') {
              this.$refs[formName].validate(valid => {
                if (valid) {
                  this.$confirm('是否确定要保存？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    // this.loading = true
                    Interface.getData('post', Interface.project.post, params).then(res => {
                      if (res.data.code == 200) {
                        // this.loading = false
                        this.$message.success('添加成功！')
                        this.$router.go(-1)
                      } else {
                        this.loading = false
                        this.$message.error('添加失败！')
                      }
                    })
                  })
                } else {
                  this.$message.info('请将内容填写完毕！')
                }
              })
            } else {
              this.$message.info('请将项目相关内容填写完整！')
            }
          }
        } else {
          if (this.projectImages.length < 4) {
            this.$message.error('上传项目图片不能少于4张！')
          } else {
            let param = form
            param._method = 'PUT'
            param.attr = `[${string}]`
            param.form_id = this.form_id
            param.images = JSON.stringify(images)
            param.web_handle_procedure = JSON.stringify(form.web_handle_procedure)
            this.$refs[formName].validate(valid => {
              if (valid) {
                this.$confirm('是否确定要修改？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  // this.loading = true
                  Interface.getData('post', Interface.project.post + '/' + this.$route.params.id, param).then(
                    res => {
                      if (res.data.code == 200) {
                        // this.loading = false
                        this.$message.success('修改成功！')
                        this.$router.go(-1)
                      } else {
                        // this.loading = false
                        this.$message.error('修改失败！')
                      }
                    })
                })
              } else {
                console.log('error')
              }
            })
          }

        }
      },
      checkString() {
        if (this.form.introduce != null && this.form.introduce != '') {
          this.form.introduce = this.form.introduce.replace(/font-size:[/d]{1,2}px/g, 'font-size:15px')
        }
        if (this.form.advantage != null && this.form.advantage != '') {
          this.form.advantage = this.form.advantage.replace(/font-size:[/d]{1,2}px/g, 'font-size:15px')
        }
        if (this.form.apply_condition != null && this.form.apply_condition != '') {
          this.form.apply_condition = this.form.apply_condition.replace(/font-size:[/d]{1,2}px/g, 'font-size:15px')
        }
        if (this.form.handle_procedure != null && this.form.handle_procedure != '') {
          this.form.handle_procedure = this.form.handle_procedure.replace(/font-size:[/d]{1,2}px/g, 'font-size:15px')
        }
      },
      cancel() {
        this.$router.go(-1)
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
      CKEDITOR.instances['editor'].setData(form[this.types])
      if (this.$route.params.id != 'add') {
        this.form = form
        this.attr = this.form.attr
        this.projectImages = this.form.images
        if(this.form.images){
          this.form.projectImages = this.form.images[0].url
        }
        this.$refs.singleImage.imageUrl = this.form.picture
        this.$refs.pictureUpload.imageFile = this.form.images
        // CKEDITOR.instances['editorPublic'].setData(this.form.introduce_public)
      }
    },
    created() {
      this.fetch('list')
      this.fetch('country')
      this.fetch('category')
      this.fetch('visa')
    },
    watch: {
      types: function (newVal, oldVal) {
        if (this.form[newVal]) {
          this.form[oldVal] = CKEDITOR.instances.editor.getData();
          CKEDITOR.instances.editor.setData(this.form[newVal]);
        } else {
          this.form[oldVal] = CKEDITOR.instances.editor.getData();
          CKEDITOR.instances.editor.setData('');
        }
      },
      annotationId: function (newVal, oldVal) {
        this.options.map(element => {
          if (element.id == newVal) {
            if (element.annotation != '移民目的') { //非移民目的单选
              if (this.$route.params.id == 'add') { //添加项目的时候
                this.selectValue = element.checkedArr[0];
              } else { //修改项目获取数据
                if (this.form.attr.length != 0) {
                  this.form.attr.forEach(elem => {
                    if (elem.question_id == this.annotationId) {
                      element.checkedArr = [...elem.question_answer]
                      this.selectValue = element.checkedArr[0]
                    }
                  })
                } else {
                  this.selectValue = element.checkedArr[0];
                }
              }
            } else { //移民目的  多选
              if (this.$route.params.id == 'add') {
                this.multipleValue = element.checkedArr;
              } else {
                if (this.form.attr.length != 0) {
                  this.form.attr.forEach(elem => {
                    if (elem.question_id == this.annotationId) {
                      element.checkedArr = elem.question_answer
                      this.multipleValue = elem.question_answer
                    }
                  })
                } else {
                  this.multipleValue = element.checkedArr;
                }
              }
            }
          }
        })
      }
    },
    beforeRouteEnter: (to, from, next) => {
      // ...
      if (to.params.id != 'add') {
        Interface.getData('get', `${Interface.project.get}/${to.params.id}`).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data
            data.is_hot = data.is_hot.toString()
            data.status = data.status.toString()
            data.hot_search = data.hot_search.toString()
            data.main_push = data.main_push.toString()
            if(data.web_handle_procedure != null){
              data.web_handle_procedure = JSON.parse(data.web_handle_procedure)
            } else {
              data.web_handle_procedure = []
            }
            form = res.data.data
          }
          next()
        })
      } else {
        form = {
          web_handle_procedure: [{
            id: 0,
            content: '',
          }],
          title: '',
          intro: '',
          introduce: '',
          advantage: '',
          apply_condition: '',
          handle_procedure: '',
          attr: ''
        }
        next()
      }

    }
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

  .el-form-item__content {
    line-height: 0;
  }

  .project-form .input-content {
    width: 50%;
  }

</style>
