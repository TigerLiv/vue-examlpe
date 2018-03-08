<template>
	<div>
		<el-upload :action="uploadUrl" :data="imageData" list-type="picture-card" :before-upload="beforeUpload" :on-preview="avatarPreview"
		 :on-change="avatarChange" :on-success="avatarSuccess" :on-error="avatarError" :on-remove="avatarRemove" :file-list="imageFile">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog v-model="dialogVisible" size="tiny">
			<img width="100%" :src="imageUrl" alt="">
		</el-dialog>
		<!-- <span class="tips">只能上传jpg/png文件,且不超过5MB</span> -->
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
				const isLt2M = file.size / 1024 / 1024 < 5;
				if (!isLt2M) {
					this.$message.error('图片已超过5MB，请重新上传!');
					this.imageFile = []
				}
				return isLt2M;
			},
			avatarPreview(file) {
				this.previewUrl = file.url;
				this.dialogVisible = true;
			},
			avatarChange(file, fileList) {
				this.imageFile = fileList.slice(-1);
			},
			avatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
				this.image.path = res.data.path;
				this.image.path_mini = res.data.thumbPath
				this.$emit('getUrl', res.data.path)
			},
			avatarError(res, file) {
				console.log(res)
			},
			avatarRemove(file, fileList) {
				this.image.path = '',
				this.image.path_mini = ''
				this.imageFile = []
			},
			addImage(arr) {
				this.imageFile = arr;
			}
		},
		created() {

		},
	}

</script>
<style scoped>
	.tips {
		display: block;
		position: absolute;
		top: 150px;
		margin-bottom: 20px;
	}
	
</style>