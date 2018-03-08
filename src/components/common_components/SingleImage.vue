<template>
  <div class="single-upload">
    <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :before-upload="beforeUpload" :on-preview="avatarPreview"
      :on-success="avatarSuccess" :on-error="avatarError" :on-remove="avatarRemove">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" width="148px" height="148px">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <span class="upload-tips">上传图片只能是 JPG或者PNG 格式!</span>
  </div>
</template>

<script>
  import Interface from '@/util/interface.js';
  import AxiosConfig from '@/util/axios-config';
  export default {
    data() {
      return {
        uploadUrl: AxiosConfig.baseURL + Interface.image.upload,
        imageUrl: ''
      }
    },
    methods: {
      beforeUpload(file) {
        if (!(file.type == 'image/jpeg' || file.type == 'image/png')) {
          this.$message.error('上传图片只能是 JPG或者PNG 格式!');
        }
        const isType = (file.type == 'image/jpeg' || file.type == 'image/png')
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$message.error('图片已超过5MB，请重新上传!');
        }
        return isLt2M && isType;
      },
      avatarPreview(file) {
        this.previewUrl = file.url;
        this.dialogVisible = true;
      },
      avatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$emit('getUrl', res.data.path)
      },
      avatarError(res, file) {
        console.log(res)
        this.$message.error('出错了')
      },
      avatarRemove(file, fileList) {
        this.image.path = ''
        this.image.path_mini = ''
      },
    }
  }

</script>
<style>
  .single-upload {
    position: relative;
  }
  .upload-tips {
    position: absolute;
    top: 10px;
    left: 158px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px !important;
    text-align: center;
  }

</style>
