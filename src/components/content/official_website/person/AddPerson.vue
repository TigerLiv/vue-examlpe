<template>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
      <el-form-item label="类型" prop="category">
        <el-select v-model="form.category" placeholder="请选择类型">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="头衔" prop="rank">
        <el-input v-model="form.rank"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="head_img">
        <el-input v-model="form.head_img" v-show="false"></el-input>
        <single-image ref="head_img" @getUrl="getPicture"></single-image>
      </el-form-item>
      <el-form-item label="公司" prop="organization_id">
        <el-select v-model="form.organization_id" placeholder="请选择类型">
          <el-option v-for="item in organOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="country_ids">
        <el-select multiple v-model="tagsOptions" placeholder="请选择" @change="valueChange('country',$event)" style="width:50%">
          <el-option v-for="item in countryOptions" :key="parseInt(item.id)" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评分等级" prop="grade">
        <el-input-number v-model="form.grade" :min="1" :max="5" label="评分等级"></el-input-number>
      </el-form-item>
      <el-form-item label="介绍" prop="intro">
        <el-input type="textarea" v-model="form.intro" :rows="10"></el-input>
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
  import SingleImage from '@/components/common_components/SingleImage.vue'
  export default {
    data() {
      return {
        btnDisabled: false,
        show: false,
        form: {},
        categoryOptions: [],
        organOptions: [],
        tagsOptions: [],
        countryOptions: [],
        options: [],
        ids: '',
        rules: {
          category: [{
            required: true,
            message: '请选择分类',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          rank: [{
            required: true,
            message: '请输入头衔',
            trigger: 'blur'
          }],
          head_img: [{
            required: true,
            message: '请输入上传图片',
            trigger: 'change'
          }],
          organization_id: [{
            required: true,
            message: '请选择公司',
            trigger: 'change'
          }],
          country_ids:[{
            required: true,
            message: '请选择标签',
            trigger: 'blur'
          }],
          grade: [{
            required: true,
            message: '请评分',
            trigger: 'blur'
          }],
          intro: [{
            required: true,
            message: '请输入人员介绍',
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
          Interface.getData('get', Interface.website.person.category).then(res => {
            if (res.data.code == 200) {
              this.categoryOptions = res.data.data
            }
          })
        } else if ('organ' == scence) {
          Interface.getData('get', Interface.website.company.get).then(res => {
            if (res.data.code == 200) {
              this.organOptions = res.data.data
            }
          })
        } else if ('country' == scence) {
          Interface.getData('get', Interface.project.country).then(res => {
            if (res.data.code == 200) {
              this.countryOptions = res.data.data
            }
          })
        } else if ('detail' == scence) {
          Interface.getData('get', Interface.website.person.get + '/' + this.$route.params.id).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data
              this.form = res.data.data
              this.$refs.head_img.imageUrl = this.form.head_img
              this.tagsOptions = []
              data.country.forEach(val => {
                this.tagsOptions.push(val.id)
              })
            }
          })
        }
      },
      save(formName) {
        let tops = '';
        this.tagsOptions.forEach((val, index) => {
          tops += val
          if (index < this.tagsOptions.length - 1) {
            tops += ','
          }
        })
        this.form.country_ids = '[' + tops + ']'
        if (this.$route.params.id == 'add') {
          let params = this.form
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.person.post, this.form).then(res => {
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
          this.$refs[formName].validate(valid => {
            if (valid) {
              Interface.getData('post', Interface.website.person.post + '/' + this.$route.params.id, param).then(
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
      getPicture(url) {
        this.form.head_img = url
      },
      valueChange(scence, params) {

        if ('country' == scence) {
        //   console.log(params, this.tagsOptions)
        //   let tops = ''
        //   params.forEach((val, index) => {
        //     tops += val
        //     if (index < params.length - 1) {
        //       tops += ','
        //     }
        //   })
        //   this.ids = tops
        }
      }
    },
    mounted() {

    },
    created() {
      this.fetch('category')
      this.fetch('country')
      this.fetch('organ')
      if (this.$route.params.id != 'add') {
        this.fetch('detail')
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
