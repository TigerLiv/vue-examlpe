<template>
  <div>
    <el-upload :action="uploadUrl" :data="imageData" list-type="picture-card" :before-upload="beforeUpload" :on-preview="avatarPreview"
      :on-change="avatarChange" :on-success="avatarSuccess" :on-error="avatarError" :on-remove="avatarRemove" :file-list="imageFile">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
    <!-- <span class="tips">只能上传jpg/png文件,且不超过5MB,不能少于4张！</span> -->
  </div>
</template>
<script>
  import Interface from '@/util/interface.js';
  import AxiosConfig from '@/util/axios-config';
  export default {
    data() {
      return {
        uploadUrl: AxiosConfig.baseURL + Interface.image.upload,
        imageUrl: '',
        imageFile: [],
        dialogVisible: false,
        imageData: {
          thumb: 1,
          dir: 'image/tpy'
        },
        image: {}
      }
    },
    methods: {
      beforeUpload(file) {
        if (!(file.type == 'image/jpeg' || file.type == 'image/png')) {
          this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
          this.imageFile = []
        }
        const isType = (file.type == 'image/jpeg' || file.type == 'image/png')
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$message.error('图片已超过5MB，请重新上传!');
          this.imageFile = []
        }
        return isLt2M && isType;
      },
      avatarPreview(file) {
        this.imageUrl = file.url;
        this.dialogVisible = true;
      },
      avatarChange(file, fileList) {
        this.imageFile = fileList.slice(-4);
      },
      avatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.image.path = res.data.path;
        this.image.path_mini = res.data.thumbPath
        let images = []
        console.log(this.imageFile)
        this.$emit('getUrl', this.imageFile)
      },
      avatarError(res, file) {
        console.log(res)
      },
      avatarRemove(file, fileList) {
        this.imageFile = fileList;
        this.$emit('removeImage', this.imageFile);
      },
    },
    created() {

    }
  }

</script>
<style>
  .tips {
    display: block;
    position: absolute;
    top: 157px;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions span{
    display: none !important;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions:hover span{
    display: none !important;
  }
</style>
