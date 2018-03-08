<template>
	<div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
		<el-row>
			<el-col>
				<el-input placeholder="请输入国家名称" suffix-icon="el-icon-search" v-model="condition" style="width:200px" @blur="fetch('list')" @keyup.enter="fetch('list')"></el-input>
				<el-button class="btn-right" @click="add">添加</el-button>
			</el-col>
			<el-col>
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column prop="name" label="国家名称"></el-table-column>
					<el-table-column prop="continent" label="所属大洲"></el-table-column>
					<el-table-column prop="hot" label="是否热门">
						<template slot-scope="scope">
							<span>{{scope.row.hot == 1?'热门':'非热门'}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="flag_picture" label="国旗">
						<template slot-scope="scope">
							<img :src="scope.row.flag_picture" width="50px">
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="edit(scope.row)" class="detail">编辑</el-button>
							<el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col style="margin:15px 0;">
				<el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"> </el-pagination>
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
				forbid: false,
				tableData: [],
				form: {
					name: '',
				},
				dialogFormVisible: false,
				id: null,
				status: true,
				tips: '',
				total: 1,
				currentPage: '',
				loading:true,
				condition:'',
			}
		},
		methods: {
			fetch() {
				let params = {
					page: this.currentPage,
					pageSize: 10,
					backend: 1,
					condition:this.condition
				}
				Interface.getData('get', Interface.country.get, params).then(res => {
					if (res.data.code == 200) {
						this.loading = false
						this.total = res.data.data.total
						this.tableData = res.data.data.data
					}
				})
			},
			add() {
				this.$router.push('/country/add')
			},
			edit(row) {
				this.$router.push('/country/' + row.id)
			},
			destory(row) {
				this.id = row.id
				var params = {
					id: row.id,
					_method: 'DELETE'
				}
				this.$confirm('是否确定要删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					Interface.getData('post', Interface.country.delete + '/' + row.id, params).then(res => {
						if (res.data.code == 200) {
							this.$message.success('删除成功!');
							this.fetch()
						} else if (res.data.code == 40006) {
							this.$message.warning('请勿删除！');
						}
					})
				}).catch(() => {
					this.$message({
						type: 'error',
						message: '已取消删除'
					});
				});
			},
			pageChange(num) {
				this.currentPage = num
				this.fetch()
			}
		},

		created() {
			this.fetch()
		}
	}

</script>
<style scoped>
	@import '../../../../assets/css/container.css';
	.el-dialog--small {
		width: 30% !important;
	}

	.dialog-input {
		margin: 30px 0;
	}
</style>