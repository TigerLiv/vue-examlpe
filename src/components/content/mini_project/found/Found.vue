<template>
    <div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <el-row>
            <el-col :span="18">
                <el-tabs v-model="activeName" @tab-click="tabclick">
                    <el-tab-pane label="自创文章" name="0"></el-tab-pane>
                    <el-tab-pane label="公众号文章" name="1"></el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="1" :offset="4">
                <el-button @click="add">添加文章</el-button>
            </el-col>
            <el-col>
                <!-- <el-date-picker v-model="startTime" align="right" type="datetime" placeholder="选择日期" @change="timeChange('start',$event)">
              </el-date-picker>
              <el-date-picker v-model="endTime" align="left" type="datetime" placeholder="选择日期" @change="timeChange('end',$event)">
              </el-date-picker> -->
            </el-col>
            <el-col>
                <div>
                    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
                        <el-table-column prop="name" label="标题"></el-table-column>
                        <el-table-column prop="value" label="图片">
                            <template slot-scope="sco">
                                <img :src="sco.row.img" alt="" width="50px">
                            </template>
                        </el-table-column>
                        <el-table-column prop="keyword" label="底部串语"></el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="edit('status',scope.row)">{{tableData[scope.$index].status == 1?'下架':'上架'}}</el-button>
                                <el-button type="text" size="small" @click="edit('edit',scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col style="margin:15px 0;">
                <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange" v-if="total != 0"> </el-pagination>
            </el-col>
        </el-row>

    </div>
</template>
<script>
    import Interface from '@/util/interface'
    import ImageUpload from '@/components/common_components/ImageUpload.vue';
    export default {
        data() {
            return {
                activeName: this.$store.state.foundActiveName,
                total: 0,
                currentPage: 1,
                categoryOptions: [],
                category_id: '',
                tableData: [],
                id: '',
                form: {},
                loading:true,
            }
        },
        components: {
            'imageUpload': ImageUpload
        },
        methods: {
            fetch(scence) {
                let params = {
                    page: this.currentPage,
                    pageSize: 10,
                    type: this.activeName,
                    backend: 1
                }
                if ('list' == scence) {
                    Interface.getData('get', Interface.found.get, params).then((res) => {
                        if (res.data.code == 200) {
                            let data = res.data.data.data
                            this.tableData = data;
                            this.total = res.data.data.total
                            this.loading = false
                        } else if (res.data.code == 40001) {
                            this.tableData = []
                            this.loading = false
                        }
                    })
                }

            },
            add() {
                this.$router.push('/found/add')
            },
            edit(scence, row) {
                if ('edit' == scence) {
                    this.$router.push('/found/' + row.id)
                } else if ('status' == scence) {
                    let params = { _method: 'put' }
                    if (row.status == 1) {
                        params.status = 0
                    } else {
                        params.status = 1
                    }
                    Interface.getData('post', `${Interface.found.put}/${row.id}/status`, params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('成功')
                            this.fetch('list')
                        } else {
                            this.$message.error('失败')
                        }
                    })
                }
            },
            destory(row) {
                var params = {
                    _method: 'DELETE'
                }
                this.$confirm('是否确定要删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Interface.getData('post', Interface.found.delete + '/' + row.id, params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('删除成功!');
                            //删除成功之后页面刷新
                            this.fetch('list')
                        } else if (res.data.code == 40001) {
                            this.$message.warning('不能删除!');
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
                this.currentPage = num;
                this.fetch('list')
            },
            tabclick(tab) {
                this.$store.state.foundActiveName = tab.name
                this.fetch('list')
            }
        },
        created() {
            this.fetch('list')
        }
    }

</script>
<style scoped lang="scss">
    @import '../../../../assets/css/container.css';
    .detail {
        border: none;
        background: transparent;
        &:hover {
            background: transparent;
            color: #333;
        }
    }

    .el-upload-list {
        width: 25% !important;
    }

    .avator {
        margin-top: 6px;
        width: 50px;
        height: 50px;
    }

    .el-upload-list--picture-card {
        position: absolute;
        left: -100px;
    }

    .modelBtn {
        margin-bottom: 5px;
    }

    .el-form-item {
        margin-bottom: 50px;
    }
</style>