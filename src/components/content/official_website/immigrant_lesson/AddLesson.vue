<template>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
      <el-form-item label="视频名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="视频封面" prop="cover">
        <el-input v-model="form.cover" v-show="false"></el-input>
        <single-image ref="lessonImage" @getUrl="getFile"></single-image>
      </el-form-item>
      <el-form-item label="主讲人" prop="speaker_id">
        <el-select v-model="form.speaker_id" placeholder="请选择主讲人">
          <el-option v-for="item in speakerOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="栏目" prop="column_id">
        <el-select v-model="form.column_id" placeholder="请选择视频栏目">
          <el-option v-for="item in cloumnOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频类型" prop="category_id">
        <el-select v-model="categories" multiple placeholder="请选择视频类型" @change="valueChange('category',$event)" style="width:60%">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.title" :value="item.id.toString()">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-select v-model="countries" multiple placeholder="请选择视频国家" @change="valueChange('country',$event)" style="width:60%">
          <el-option v-for="item in countryOptions" :key="item.id" :label="item.name" :value="item.id.toString()">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词" prop="keywords">
        <el-input v-model="form.keywords"></el-input>
      </el-form-item>
      <el-form-item label="视频介绍" prop="description">
        <el-input type="textarea" v-model="form.description" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="上传视频" prop="videoId">
        <el-input v-model="form.videoId" v-show="false"></el-input>
        <upload-plugin @videoId="getVid"></upload-plugin>
      </el-form-item>
      <el-form-item>
        <ali-video ref="playVideo" v-if="id != 'add'"></ali-video>
      </el-form-item>
      <el-form-item>
        <el-button @click="save('form')" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  import Interface from '@/util/interface'
  import SingleImage from '@/components/common_components/SingleImage.vue';
  import UploadPlugin from '@/components/common_components/play/UploadPlugin.vue'
  import AliVideo from '@/components/common_components/play/PlayVideo.vue';
  export default {
    data() {
      return {
        btnDisabled: false,
        show: false,
        ids: '',
        form: {},
        rules: {
          name: [{
            required: true,
            message: '请输入视频标题',
            trigger: 'blur'
          }],
          cover: [{
            required: true,
            message: '请上传视频封面',
            trigger: 'change'
          }],
          speaker_id: [{
            required: true,
            message: '请选择主讲人',
            trigger: 'change'
          }],
          column_id: [{
            required: true,
            message: '请选择栏目',
            trigger: 'change'
          }],
          category_id: [{
            required: true,
            message: '请选择视频类型',
            trigger: 'change'
          }],
          country: [{
            required: true,
            message: '请选择所属国家',
            trigger: 'change'
          }],
          keywords:[{
            required: true,
            message: '请填写关键词',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入视频介绍',
            trigger: 'blur'
          }],
          videoId: [{
            required: true,
            message: '请输入上传视频',
            trigger: 'blur'
          }],
        },
        categories: [],
        countries: [],
        speakerOptions: [],
        categoryOptions: [],
        countryOptions: [],
        cloumnOptions: [],
        id: this.$route.params.id,
        videoId: '',
        country_id:'',
      }
    },
    components: {
      SingleImage,
      UploadPlugin,
      AliVideo,
    },
    methods: {
      fetch(scence) {
        if ('speaker' == scence) {
          //专题讲师
          Interface.getData('get', Interface.website.lesson.get_speaker).then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data
              this.speakerOptions = data;
            }
          }).then(() => {
            //专题栏目
            Interface.getData('get', Interface.website.lesson.get_cloumn).then(res => {
              if (res.data.code == 200) {
                this.cloumnOptions = res.data.data
              }
            })
          })
        } else if ('category' == scence) {
          //专题类型
          Interface.getData('get', Interface.project.category).then(res => {
            if (res.data.code == 200) {
              this.categoryOptions = res.data.data
            }
          }).then(() => {
            //专题所属国家
            Interface.getData('get', Interface.project.country).then(res => {
              if (res.data.code == 200) {
                this.countryOptions = res.data.data
              }
            })
          })
        } else if ('detail' == scence) {
          Interface.getData('get', `${Interface.website.lesson.get_lesson}/${this.$route.params.id}`).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data
              this.form = Interface.cloneObj(data)
              this.videoId = data.videoId
              this.ids = data.category_id
              this.$refs.lessonImage.imageUrl = data.cover
              this.$refs.playVideo.fetch(data.videoId)
              this.categories = res.data.data.category_id.split(',')
              this.countries = res.data.data.country.split(',')
            }
          })
        }
      },
      save(formName) {
        if (this.$route.params.id == 'add') {
          let params = this.form
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.lesson.post_lesson, params).then(res => {
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
          param._method = 'PUT'
          if (this.videoId != this.form.videoId) {
            param.is_new_video = 1
          } else {
            param.is_new_video = 0
          }
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.lesson.post_lesson + '/' + this.$route.params.id, param).then(
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
      getFile(url) {
        this.$set(this.form,'cover',url)
        // this.form.cover = url
      },
      //获取videoId
      getVid(vid) {
        this.$set(this.form, 'videoId', vid)
        // this.form.videoId = vid
        setTimeout(() => {
          if (this.$route.params.id != 'add') {
            this.fetch('detail')
          }
        }, 500)
      },
      valueChange(scence, params) {
        let tops = ''
        params.forEach((val, index) => {
          tops += val
          if (index < params.length - 1) {
            tops += ','
          }
        })
        console.log(params)
        if ('category' == scence) {
          this.ids = tops
          this.form.category_id = tops
        } else if('country' == scence) {
          this.country_id = tops
          this.form.country = tops
          console.log(tops,'tops')
        }
      }
    },
    mounted() {

    },
    created() {
      this.fetch('speaker')
      this.fetch('category')
      if (this.$route.params.id != 'add') {
        this.show = true
        this.fetch('detail')

      } else {
        this.show = false
      }
    }
  }

</script>
<style scoped>
  @import '../../../../assets/css/container.css';

</style>
