<template>
	<div class="container">
		<el-row>
			<el-col>
				<el-button class="btn-right" @click="Add">添加</el-button>
			</el-col>
			<el-col>
				<el-table
				    :data="tableData"
				    stripe
				    style="width: 100%">
				    <el-table-column
				      prop="v_name"
				      label="名字"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="status"
				      label="状态"
				      >
				    </el-table-column>
				   	<el-table-column label="操作">
				      <template scope="scope">
				      	<el-button type="primary" size="small" @click="playVideo(scope.row)" class="detail" :disabled="scope.row.play">播放</el-button>
				      </template>
				    </el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import Interface from '@/util/interface'
	import qs from 'qs'
	export default {
		data() {
			return {
				tableData:[],
				form:{
					name:'',
				},
				dialogFormVisible:false,
				id:null,
				play:true
			}
		},
		methods: {
			Fetch() {
				var that = this
				that.axios.get(
			  		Interface.upload.get
			  	).then((res) => {
			  		if (res.status == 200) {
			  			that.tableData = res.data.data.data
			  		// 	console.log(this.tableData)
			  			that.tableData.forEach(function(val,key){
			  				if('Normal' != val.status){
								val.play = true;

							}else{
								val.play = false;
							}
			  			})

			  		}
			  	}).catch((res) => {
			  	})
			},
			Add() {
				this.$router.push({path:'/uploader'})
			},
			playVideo(row) {
				this.$router.push({path:'/play-video/'+row.v_videoId})
				var params = {
					videoId:row.v_videoId
				}

			},
		},

		created() {
			this.Fetch()
		}
	}
</script>
<style scoped>
	@import '../../../assets/css/global.css';
	@import '../../../assets/css/container.css';

	.el-dialog--small {
		width: 30% !important;
	}
	.dialog-input {
		margin:30px 0;
	}

</style>
