<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="project-form">
      <el-form-item label="子项目名称" prop="title">
        <el-input v-model="form.title" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="子项目简介" prop="intro">
        <el-input v-model="form.intro" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="子项目优势" prop="advantage">
        <el-input v-model="form.advantage" class="input-content"></el-input>
      </el-form-item>
      <el-form-item label="子项目封面" prop="picture">
        <el-input v-model="form.picture" v-show="false"></el-input>
        <single-image ref="childSingleImage" @getUrl="edit('singleImage',$event)"></single-image>
      </el-form-item>
      <el-form-item label="子项目图片" prop="projectImages">
        <el-input v-model="form.projectImages" v-show="false"></el-input>
        <picture-upload ref="childPictureUpload" @getUrl="edit('pictureUpload',$event)" @removeImage="edit('removePicture',$event)"></picture-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="save('form')" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Interface from '@/util/interface'
  import SingleImage from '@/components/common_components/SingleImage.vue'
  import PictureUpload from '@/components/common_components/PictureUpload.vue'
  export default {
    data() {
      return {
        form: {},
        btnDisabled: false,
        projectImages: [],
        rules: {},
      }
    },
    components: {
      SingleImage,
      PictureUpload
    },
    methods: {
      fetch(scence) {
        if ('detail' == scence) {
          Interface.getData('get', `${Interface.project.get}/${this.$route.params.id}`).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data
              this.form = res.data.data
              this.$refs.childSingleImage.imageUrl = this.form.picture
              this.$refs.childPictureUpload.imageFile = this.form.images
              this.projectImages = this.form.images
            }
          })
        }
      },
      edit(scence, params) {
        if ('singleImage' == scence) {
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
        }
      },
      save(formName) {
        let images = []
        this.projectImages.forEach((val, index) => { //项目图片
          images.push({
            id: val.id,
            url: val.url
          })
        })
        let form = Interface.cloneObj(this.form)
        if (this.$route.params.type == 'add') {
          if (this.projectImages.length < 4) {
            this.$message.error('上传项目图片不能少于4张！')
          } else {
            param.pid = this.$route.params.id
            params.images = JSON.stringify(images)
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
            param.pid = this.$route.params.id
            param.images = JSON.stringify(images)
            this.$refs[formName].validate(valid => {
              if (valid) {
                this.$confirm('是否确定要修改？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  // this.loading = true
                  Interface.getData('post', `${Interface.project.post}/${this.$route.params.id}`, param).then(
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
      cancel() {
        this.$router.go(-1)
      }
    },
    created() {
      if (this.$route.params.type != 'add') {
        this.fetch('detail')
      }

    }
  }

</script>
