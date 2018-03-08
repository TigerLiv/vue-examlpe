<template>
  <div class="upload-plugin">
    <p class="p_up">
      <a class="up">选择文件</a>
      <input type="file" id="files" @change="selectChange()" ref="inputer">
    </p>
    <el-button type="danger" @click="stop()" v-show="show">停止上传</el-button>
    <el-button type="success" @click="start()" v-show="showStart">开始上传</el-button>
    <el-button type="primary" @click="cleanFile()" v-show="showDelete">删除文件</el-button>

    <el-progress :text-inside="true" :stroke-width="18" :percentage="percent"></el-progress>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Interface from '@/util/interface'
  export default {
    data() {
      return {
        videoData: {},
        vId: '',
        uploader: '',
        files: '',
        percent: 0,
        show: false,
        uploadInfo: null,
        showDelete: false,
        showStart: false,
      };
    },
    methods: {
      fetch() {
        var that = this;
        this.axios({
          url: Interface.video.upload,
          method: 'get',
        }).then((res) => {
          if (res.status == 200) {
            that.videoData = res.data.data;
            that.vId = res.data.data.videoId
            that.uploader = new VODUpload({
              // 文件上传失败
              onUploadFailed(uploadInfo, code, message) {
                that.$message.error('上传失败！');
              },
              // 文件上传完成
              onUploadSucceed(uploadInfo) {
                that.uploadInfo = uploadInfo
                that.$message({
                  message: '上传成功！',
                  type: 'success'
                });
                that.showDelete = true;
                that.transferVid();
                var File = document.getElementById('files');
                if (File != null) {
                  File.value = ''
                  $('#files').val('')
                }
              },
              // 文件上传进度
              onUploadProgress(uploadInfo, totalSize, uploadedSize) {
                var percent = Math.ceil(uploadedSize * 100 / totalSize)
                that.percent = percent
              },
              // STS临时账号会过期，过期时触发函数
              onUploadTokenExpired() {
                that.log("onUploadTokenExpired");
              },
              // 开始上传
              onUploadstarted(uploadInfo) {
                if (!(uploadInfo.file.type == 'video/mp4' || uploadInfo.file.type == 'video/mov' || uploadInfo.file.type == 'video/mpg' || uploadInfo.file.type == 'video/mpeg')) {
                  that.$message.error('上传文件格式只能是 MP4、MPG、MPEG或者MOV 格式!');
                  that.uploader.cleanList();

                } else {
                  that.uploader.setUploadAuthAndAddress(
                    uploadInfo,
                    that.videoData.uploadAuth,
                    that.videoData.uploadAddress
                  );
                }
              }
            });
            that.uploader.init();
          } else {
            console.log('错误信息：' + res.status);
          }
        }).then(() => {
          that.transferVid()
        }).catch((res) => {
          console.log(res);
        })
      },
      selectChange() {
        var userData = '{"Vod":{"UserData":"{"IsShowWaterMark":"false","Priority":"7"}"}}';
        this.uploader.addFile(this.$refs.inputer.files[0], null, null, null, userData);
        this.start()
        this.show = true

      },
      start() {
        this.uploader.startUpload();
      },
      stop() {
        this.showStart = true
        this.uploader.stopUpload();
      },
      deleteFile() {
        this.uploader.deleteFile();
      },
      cancelFile() {
        this.uploader.cancelFile();
      },
      cleanFile() {
        this.uploader.cleanList();
        this.percent = 0
        this.$message.success('文件删除成功，可以重新上传！')
        this.showStart = true;
      },
      transferVid() {
        if (this.uploadInfo == null) {
          this.$emit('videoId', '')
        } else {
          this.$emit('videoId', this.vId)
          console.log(this.vId, 'id')
        }
      }
    },
    created() {
      this.fetch()
    },
    mounted() {

    }
  }

</script>

<style scoped>
  .upload-plugin {
    margin-bottom: 20px;
  }
.el-progress{
    width: 60% !important;
  }
  
  .p_up {
    margin-top: 10px;
    position: relative;
    width: 50%;
  }
  
  .up {
    color: #000;
    border: 1px solid #ddd;
    padding: 10px;
  }
  .el-progress--text-inside .el-progress-bar{
    margin-top: 10px;
  }
  #files {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: -80px;
    opacity: 0;
  }
  
  .stop,
  .start {
    cursor: pointer;
    padding: 8px;
    background: skyblue;
    margin: 15px 0;
    border: 1px solid #fff;
    outline: none;
    color: #fff;
  }
  
  .stop {
    background: #e4393c;
  }
</style>