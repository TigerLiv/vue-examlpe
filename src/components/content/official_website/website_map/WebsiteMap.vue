<template>
    <div class="container">
      <el-row>
        <el-col>
          <el-button type="primary" class="add-style" @click="status.showForm = true;treeSpans = 12">添加</el-button>
        </el-col>
        <el-col :span="treeSpans">
          <el-tree
            :data="tag"
            :props="defaultProps"
            node-key="id"
            accordion
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-click="nodeClick">
          </el-tree>
        </el-col>
        <el-col :span="12" v-show="status.showForm">
          <el-form :model="form" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" auto-complete="off" class="dialog-input"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="link">
                <el-input v-model="form.link" auto-complete="off" class="dialog-input"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" auto-complete="off" class="dialog-input"></el-input>
            </el-form-item>
            <el-form-item label="关键字" prop="keywords">
                <el-input v-model="form.keywords" auto-complete="off" class="dialog-input"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input type="textarea" v-model="form.description" auto-complete="off" class="dialog-input" :rows="5"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save('ruleForm')">保存</el-button>
                <el-button @click="status.showForm = false;treeSpans = 24">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
            children: 'children',
            label: 'label'
          },
          form:{},
          rules:{
            name:[{required:true,message:'请输入名称',trigger:'blur'}],
            link:[{required:true,message:'请输入链接',trigger:'blur'}],
            title:[{required:true,message:'请输入标题',trigger:'blur'}],
            keywords:[{required:true,message:'请输入关键字',trigger:'blur'}],
            description:[{required:true,message:'请输入描述',trigger:'blur'}],
          },
          appendId:0,
          editId:0,
          editName:'',
          status:{
            showForm:false,
            type:'add'
          },
          treeSpans:24,
          pid:'',
        }
      },
  
      methods: {
        fetch() {
            var that = this
            this.tag = []
            Interface.getData('get',Interface.website.map.get).then((res) => {
              if (res.data.code == 200) {
                res.data.data.forEach(function (val) {
                  let obj = {};
                  obj.id = val.id;
                  obj.label = val.name;
                  obj.children = [];
                  if (val.child) {
                    val.child.forEach(function (ele) {
                      let obj_children = {};
                      obj_children.children = []
                      obj_children.id = ele.id;
                      obj_children.label = ele.name;
                      obj_children.identify = ele.identify
                      obj.children.push(obj_children);
                      if(ele.child){
                        ele.child.forEach(sub => {
                          obj_children.children.push({id:sub.id,label:sub.name,identify:sub.identify})
                        })
                      }
                    }, this);
                  }
                  this.tag.push(obj);
                }, this);          
                
              }
            }).catch((res) => {
              console.log(res)
            })  
        },
        add(store,data) {
          this.status.dialogVisible = true;
          this.status.type = 'append';
          this.appendId = data.id;
          this.status.showForm = true
          this.treeSpans = 12
          this.form = {}
        },
        edit(store,data) {
          this.status.dialogVisible = true;
          this.status.type = 'edit';
          this.editId = data.id;
          this.treeSpans = 12
          this.status.showForm = true
          Interface.getData('get',`${Interface.website.map.get}/${data.id}`).then((res) => {
            if(res.data.code == 200){
              this.form = res.data.data
            }
          })
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
                Interface.getData('post',Interface.website.map.get + '/' + data.id,params).then((res) => {
                if(res.status == 200){
                  this.fetch()
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
            params = this.form
            params.pid = 0
          }else if(this.status.type == 'append'){  //子级模块添加
            params = this.form
            params.pid = this.appendId
          }else if(this.status.type == 'edit'){  //编辑
            params = this.form
            // params.pid = this.appendId
            params._method = 'PUT'
            Interface.getData('post',Interface.website.map.post + '/' + this.editId,params)
              .then((res) => {
                if(res.status == 200 && res.data.code !=4005){
                  this.$message.success('修改成功')
                  this.status.showForm = false
                  this.treeSpans = 24
                  this.fetch()
                }else if(res.status == 200 && res.data.code ==4005){
                  this.$message.error('请勿修改重复的模块名！')
                }
              }).catch((err) => {
                console.log(err)
            })   
          }
          Interface.getData('post',Interface.website.map.post,params)
            .then((res) => {
              if(res.data.code == 200){
                this.$message.success('添加成功')
                this.status.showForm = false
                this.treeSpans = 24
                this.form = {}
                this.fetch()
              }else if(res.status == 200 && res.data.code ==4005){
                this.$message.error('请勿添加重复的模块名！')
              }
            }).catch((err) => {
              console.log(err)
          })      
        },
        closeDialog() {
          this.form.name = ''
        },
        nodeClick(obj) {
          
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
                <el-button type="text" size="mini" on-click={ () => this.add(store, data) }>添加</el-button>
                <el-button type="text" size="mini" on-click={ () => this.edit(store, data) }>修改</el-button>
                <el-button type="text" size="mini" on-click={ () => this.destory(store, data) }>删除</el-button>
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