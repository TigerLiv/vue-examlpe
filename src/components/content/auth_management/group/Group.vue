<template>
	<div class="container">
		<el-row>
			<el-col>
				<el-button type="primary" class="add-style" @click="add('0')">添加组名</el-button>
			</el-col>
			<el-col>
				<el-tree :data="tag" :props="defaultProps" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
				</el-tree>
			</el-col>
		</el-row>
		<el-dialog :visible.sync="status.dialogVisible" class="dialog" :title="title" @close="closeDialog">
      <el-form :model="form">
        <el-input v-model="form.name" auto-complete="off" class="dialog-input"></el-input>
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
        title:'请添加一级组名',
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
        roles: eval("(" + sessionStorage.getItem('roles') + ")"),
      }
    },

    methods: {
      fetch() {
        let group_id = this.roles[0].group_id
        this.tag = []
          Interface.getData('get',Interface.management.get,{id:group_id}).then((res) => {
            if (res.data.code == 200) {
              this.tag = res.data.data
            }
          }).catch((res) => {
            console.log(res)
          })  
      },
      add(store,data) {
        if(store == '0'){
         let group_id = this.roles[0].group_id
          this.$router.push(`/manage_group/add/${this.roles[0].group_id}`)
        } else {
          this.$router.push(`/manage_group/add/${data.id}`)
        }
      },
      edit(store,data) {
        this.$router.push(`/manage_group/edit/${data.id}`)
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
        if(this.status.type == 'add'){
          params = {
            name:this.form.name,
            pid:0
          }
        }else if(this.status.type == 'append'){
            params = {
              name:this.form.name,
              pid:this.appendId
            }

        }else if(this.status.type == 'edit'){
          params = {
            id:this.editId,
            name:this.form.name,
            _method:'PUT'
          }
          Interface.getData('post',Interface.management.group ,params).then((res) => {
              if(res.data.code == 200){
                this.dialogFormVisible = false;
                location.reload()
              }else if(res.status == 200 && res.data.code ==4005){
                this.$message.error('请勿修改重复的组名！')
              }
            }).catch((err) => {
              console.log(err)
          })   
        }
        Interface.getData('post',Interface.management.group,params)
          .then((res) => {
            if(res.data.code == 200){
              this.dialogFormVisible = false;
              location.reload()
            }else if(res.status == 200 && res.data.code ==4005){
              this.$message.error('请勿添加重复的组名！')
            }
          }).catch((err) => {
            console.log(err)
        })      
      },
      closeDialog() {
        this.form.name = ''
      },
      renderContent(h, { node, data, store }) {
        let showFlag = null;
        if (node.parent.parent) {
          // console.log(node.parent.parent)
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
              <el-button disabled={showFlag} size="mini" on-click={ () => this.add(store, data) }>添加</el-button>
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
  .dialog-input {
    margin:30px 0;
  }
</style>