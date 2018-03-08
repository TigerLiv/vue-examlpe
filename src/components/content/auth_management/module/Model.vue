<template>
    <div class="container">
      <el-row>
        <el-col>
          <el-button type="primary" class="add-style" @click="status.dialogVisible = true;title='请添加一级模块'">添加分类</el-button>
        </el-col>
        <el-col>
          <el-tree
            :data="tag"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">
          </el-tree>
        </el-col>
      </el-row>
      <el-dialog :visible.sync="status.dialogVisible" class="dialog" :title="title" @close="closeDialog">
        <el-form :model="form" label-width="100px" label-position="right">
          <el-form-item label="模块名">
              <el-input v-model="form.name" auto-complete="off" class="dialog-input"></el-input>
          </el-form-item>
          <el-form-item label="模块标识">
              <el-input v-model="form.identify" auto-complete="off" class="dialog-input" :disabled="status.type == 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="模块路由">
              <el-input v-model="form.route" auto-complete="off" class="dialog-input"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="status.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  <script>
    let id = 1000;
    import Interface from '@/util/interface'
    import qs from 'qs'
    export default {
      data() {
        return {
          title:'请添加一级模块',
          tag: [],
          defaultProps: {
            children: 'child',
            label: 'name'
          },
          form:{
            name:'',
          },
          appendId:0,
          editId:0,
          editName:'',
          status:{
            dialogVisible:false,
            type:'add'
          },
        }
      },
  
      methods: {
        fetch() {
            var that = this
            this.tag = []
            Interface.getData('get',Interface.management.module).then((res) => {
              if (res.data.code == 200) {
                this.tag = res.data.data
              }
            }).catch((res) => {
              console.log(res)
            })  
        },
        add(store,data) {
          this.status.dialogVisible = true;
          this.title="请添加子级模块"
          this.status.type = 'append';
          this.appendId = data.id;
          this.form.name = null
          this.form.identify = null
          this.form.route = null
        },
        edit(store,data) {
          this.status.dialogVisible = true;
          this.title="请修改子级模块"
          this.status.type = 'edit';
          this.editId = data.id;
          this.form.name = data.name;
          this.form.identify = data.identify
          this.form.route = data.route
        },
        destory(store, data) {
          var params = {
            id:data.id,
            _method:'DELETE'
          }
          this.$confirm('是否确定要删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                 this.axios.post(Interface.label.delete + '/' + data.id,qs.stringify(params))
              .then((res) => {
                if(res.status == 200){
                  location.reload()//删除成功之后页面刷新
                  this.$message.success('删除成功！')
                }
              })    
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
        },
        save() {
          var params = {}
          if(this.status.type == 'add'){  //父级模块添加
            params = {
              name:this.form.name,
              identify:this.form.identify,
              route:this.form.route,
              pid:0
            }
            Interface.getData('post',Interface.management.module,params)
            .then((res) => {
              if(res.data.code == 200){
                this.status.dialogVisible = false;
                this.fetch()
              }else if(res.status == 200 && res.data.code ==4005){
                this.$message.error('请勿添加重复的模块名！')
              }
            })
          }else if(this.status.type == 'append'){  //子级模块添加
              params = {
                name:this.form.name,
                identify:this.form.identify,
                route:this.form.route,
                pid:this.appendId,
              }
              Interface.getData('post',Interface.management.module,params)
              .then((res) => {
                if(res.data.code == 200){
                  this.status.dialogVisible = false;
                  this.fetch()
                }else if(res.status == 200 && res.data.code ==4005){
                  this.$message.error('请勿添加重复的模块名！')
                }
              })
          }else if(this.status.type == 'edit'){  //编辑
            params = {
              id:this.editId,
              name:this.form.name,
              identify:this.form.identify,
              route:this.form.route,
              _method:'PUT'
            }
            Interface.getData('post',Interface.management.module + '/' + this.editId,params).then((res) => {
                if(res.data.code ==200){
                  this.status.dialogVisible = false;
                  this.fetch()
                }else if(res.status == 200 && res.data.code ==4005){
                  this.$message.error('请勿修改重复的模块名！')
                }
              }).catch((err) => {
                console.log(err)
            })   
          }
              
        },
        closeDialog() {
          this.form.name = ''
        },
        renderContent(h, { node, data, store }) {
          let showFlag = null;
          if (node.parent.parent) {
            showFlag = true;
          } else {
            showFlag = false;
          }
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{node.label}</span>
              </span>
              <span>
                <el-button size="mini" on-click={ () => this.add(store, data) }>添加</el-button>
                <el-button size="mini" on-click={ () => this.edit(store, data) }>修改</el-button>
                <el-button size="mini" on-click={ () => this.destory(store, data) }>删除</el-button>
              </span>
            </span>
            );
        }
      },
      created() {
        this.fetch()
      }
    };
  </script>
  <style scoped>
    .el-tree {
      text-align: left;
    }
    .add-style {
      margin-bottom: 20px;
      float: right;
    }
    .el-dialog--small {
      width: 30% !important;
    }
  </style>