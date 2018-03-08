<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="ruleForm.name" width="300" ></el-input>
      </el-form-item>
      <el-form-item label="公司短语" prop="short_name">
        <el-input v-model="ruleForm.short_name" ></el-input>
      </el-form-item>
      <el-form-item label="创立时间" prop="found_time">
        <div class="block">
             <el-date-picker
                 v-model="ruleForm.found_time"
                 type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  default-value="2018-01-09"
                  @change=timeChange
                  >
             </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-input v-model="ruleForm.cover" auto-complete="off" v-show="false"></el-input>
        <single-image ref="companyImage" @getUrl="getFile"></single-image>
      </el-form-item>
      <el-form-item label="公司类别" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio :label="'1'" :key="1">总公司</el-radio>
          <el-radio :label="'0'" :key="0">分公司</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司地址" prop="address" >
        <el-input  v-model="ruleForm.address" ></el-input>
      </el-form-item>
      <el-form-item label="短地址" prop="short_address" >
        <el-input  v-model="ruleForm.short_address" ></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone" >
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="传真" prop="fax" >
        <el-input v-model="ruleForm.fax"></el-input>
      </el-form-item>
      <el-form-item label="热线" prop="hotline" >
        <el-input v-model="ruleForm.hotline"></el-input>
      </el-form-item>
      <el-form-item label="全国热线" prop="nationwide_phone" >
        <el-input  v-model="ruleForm.nationwide_phone"></el-input>
      </el-form-item>
      <el-form-item label="经度" prop="coordinate_x" >
        <el-input  v-model="ruleForm.coordinate_x"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="coordinate_y" >
        <el-input  v-model="ruleForm.coordinate_y"></el-input>
      </el-form-item>
      <el-form-item label="公司图标" prop="icon">
        <el-input v-model="ruleForm.icon" auto-complete="off" v-show="false"></el-input>
        <single-image ref="iconImage" @getUrl="getIcon"></single-image>
      </el-form-item>

       <el-form-item label="公司描述" prop="description">
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
      <el-form-item label="视频" prop="video_id" >
        <el-input v-model="ruleForm.video_id" v-show="false"></el-input>
        <upload-plugin @videoId="getVid" id="progressbar"></upload-plugin>
      </el-form-item>
      <el-form-item>
        <ali-video ref="playVideo" v-if="id != 'add'"></ali-video>
      </el-form-item>
      <el-form-item>
        <el-button @click="save('ruleForm')" type='primary' :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
import Interface from "@/util/interface";
import CKEDITOR from 'CKEDITOR';
import SingleImage from "@/components/common_components/SingleImage.vue";
import UploadPlugin from "@/components/common_components/play/UploadPlugin.vue";
import AliVideo from "@/components/common_components/play/PlayVideo.vue";
let ruleForm={
  name:'',
  short_name:'',
  found_time:'',
  cover:'',
  address:'',
  short_address:'',
  phone:'',
  fax:'',
  hotline:'',
  nationwide_phone:'',
  description:'',
  pid: '',
  icon:'',
  coordinate_x:'',
  coordinate_y:''
}
export default {
  data() {
    return {
      btnDisabled: false,
      show: false,
      ruleForm: ruleForm,
      foundTime: null,
      tagsOptions: [],
      companyOptions: [],
      categoryOptions: [],
      countryOptions: [],
      options: [],
      video_id: "",
      id: this.$route.params.id,
      rules: {
        name: [
          {
            required: true,
            message: "请输入公司名字",
            trigger: "blur"
          }
        ],
        short_name: [
          {
            required: true,
            message: "请输入公司短语",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入公司描述",
            trigger: "blur"
          }
        ],
        found_time: [
          {
            required: true,
            message: "请选择建立时间",
            trigger: "blur"
          }
        ],
        cover: [
          {
            required: true,
            message: "请上传封面",
            trigger: "change"
          }
        ],
         icon: [
          {
            required: true,
            message: "请上传公司图标",
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入公司地址",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入电话",
            trigger: "blur"
          }
        ],
        fax: [
          {
            required: true,
            message: "请输入传真(数字)",
            trigger: "blur"
          }
        ],
        hotline: [
          {
            required: true,
            message: "请输入热线电话",
            trigger: "blur"
          }
        ],
        nationwide_phone: [
          {
            required: true,
            message: "请输入全国热线(数字)",
            trigger: "blur"
          }
        ],
        coordinate_x: [
          {
            required: true,
            message: "请输入经度",
            trigger: "blur"
          }
        ],
        coordinate_y: [
          {
            required: true,
            message: "请输入纬度",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择公司类别",
            trigger: "blur"
          }
        ],
        short_address: [
          {
            required: true,
            message: "请输入公司短地址",
            trigger: "blur"
          }
        ],
      },
    }
  },
  components: {
    SingleImage,
    UploadPlugin,
    AliVideo
  },
  methods: {

    save(formName) {
      if (this.$route.params.id == "add") {
        this.ruleForm.description = CKEDITOR.instances['editor'].getData()
        
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.ruleForm.found_time = this.foundTime;
            console.log(this.ruleForm)
            Interface.getData(
              "post",
              Interface.website.company.post,
              this.ruleForm
            ).then(res => {
              if (res.data.code == 200) {
                this.$message.success("添加成功！");
                this.$router.go(-1);
              } else {
                this.$message.error("添加失败！");
              }
            });
          } else {
            console.log("error");
          }
        });
      } else {
        let param = this.ruleForm;
        let time = this.ruleForm.found_time;
        var date = new Date(time);
        this.ruleForm.description = CKEDITOR.instances['editor'].getData()
        this.ruleForm.found_time = date.getTime() / 1000;
        param._method = "PUT";
        this.$refs[formName].validate(valid => {
          if (valid) {
            Interface.getData(
              "post",
              Interface.website.company.post + "/" + this.$route.params.id,
              param
            ).then(res => {
              if (res.data.code == 200) {
                this.$message.success("修改成功！");
                this.$router.go(-1);
              } else {
                this.$message.error("修改失败！");
              }
            });
          } else {
            console.log("error");
          }
        });
      }
    },
    //获取videoId
    getVid(vid) {
      this.$set(this.ruleForm, "video_id", vid);
      ruleForm.video_id=vid;
      // this.form.videoId = vid
      setTimeout(() => {
        if (this.$route.params.id != "add") {
          this.ruleForm.video_id = ruleForm.video_id
        }
      }, 500);
    },
    cancel() {
      this.$router.go(-1);
    },
    timeChange(val) {
      this.foundTime = parseInt(val.getTime() / 1000);
    },
    getFile(url) {
      this.ruleForm.cover = url;
    },
    getIcon(url){
      this.ruleForm.icon=url;
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
        this.$refs.playVideo.fetch(ruleForm.video_id);
        this.$refs.companyImage.imageUrl = ruleForm.cover;
        this.$refs.iconImage.imageUrl=ruleForm.icon;
        this.ruleForm.found_time = Interface.getTime(ruleForm.found_time);

      }
    },
    beforeRouteEnter: (to, from, next) => {
      // ...
      if (to.params.id != 'add') {
        Interface.getData('get', `${Interface.website.company.get}/${to.params.id}`).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data
            data.type = data.type.toString()
            ruleForm = data
            next()
          }
        })
        
      } else {
        ruleForm = {
          name:'',
          short_name:'',
          found_time:null,
          cover:'',
          address:'',
          short_address:'',
          phone:'',
          fax:'',
          hotline:'',
          nationwide_phone:'',
          description:'',
          pid: '0',
          icon:'',
          coordinate_x:'',
          coordinate_y:''
        }
        next()
      }

    },
  created() {
    if (this.$route.params.id != "add") {
      this.show = true;
    } else {
      this.show = false;
    }
  },
};
</script>
<style scoped>
@import "../../../../assets/css/container.css";
@import '../../../../assets/css/ckUpload.css';
.el-input {
  width: 30% !important;
}
.el-textarea {
  width: 30% !important;
}
.el-progress--text-inside .el-progress-bar {
  width: 30% !important;
}
#progressbar .el-progress .el-progress-bar {
  width: 50% !important;
}
#progressbar .p_up {
  margin-top: 0px !important;
}
</style>
