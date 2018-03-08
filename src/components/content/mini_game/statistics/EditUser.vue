<template>
  <el-form :model="tableData" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="昵称">
      <el-input placeholder="请输入内容" v-model="tableData.nickname" :disabled="true">
      </el-input>
    </el-form-item>
    <el-form-item label="地区">
      <el-input v-model="tableData.province" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="默认手机号">
      <el-input v-model="tableData.wechat_phone" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="收到总祝福量">
      <el-input v-model="tableData.wish_receive_num" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="送出祝福量">
      <el-input v-model="tableData.wish_send_num" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="今日分享总频次">
      <el-input v-model="tableData.today_share_num" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="分享总频次">
      <el-input v-model="tableData.total_share_num" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="灯类型">
      <template slot-scope="scope">
        <div v-if="lightName">
          <el-radio v-model="radio" :label="index" v-for="(item,index) in tableData.wish" :key="item.id" @change="valueChange(index)">{{item.light_name}}</el-radio>
        </div>
      </template>
    </el-form-item>
    <el-form-item label="收到祝福量">
      <el-input v-model="wish_receive_num"></el-input>
    </el-form-item>
    <el-form-item label="分享内容">
      <el-input type="textarea" @change="sensitive" v-model="desc" width="300px"></el-input>
      <span style="color:red;font-size:13px;" v-if="sensitive_show">你的内容中存在敏感词，请重新输入</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()" :disabled="sensitive_show">保存</el-button>
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import Interface from '@/util/interface.js'
  export default {
    data() {
      return {
        ruleForm: {
          name: '1',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        num: 1,
        rules: {
          desc: [{
            required: true,
            message: '请填写活动形式',
            trigger: 'blur'
          }]
        },
        id: this.$route.params.id,
        tableData: {},
        radio: 0,
        lightName: [],
        wish_receive_num: 0,
        desc: '',
        lightId: '',
        sensitive_show:false
      };
    },
    methods: {
      fetch() {
        Interface.getData('get', Interface.light.user + '/' + this.id).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            this.tableData = data;
            data.wish.forEach(val => {
              this.lightName.push(val.light_name)
            })
            this.lightId = data.wish[0].id;
            this.wish_receive_num = data.wish[0].wish_receive_num;
            this.desc = data.wish[0].comment;
          }
        })
      },
      sensitive(val){
        let params={
          str:val
        }
        Interface.getData('post',Interface.website.sensitiveWord.check,params).then(res=>{
          if (res.data.code!=200) {
            this.sensitive_show=true
          }else{
            this.sensitive_show=false
          }
        })
      },
      valueChange(index) {
        this.lightId = this.tableData.wish[index].id;
        this.wish_receive_num = this.tableData.wish[index].wish_receive_num;
        this.desc = this.tableData.wish[index].comment;
      },
      submitForm() {
        if (true) {
          let params = {
            _method: 'put',
            wish_receive_num: this.wish_receive_num,
            comment: this.desc
          }
          Interface.getData('post', Interface.light.edit_wish + '/' + this.lightId, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success("修改成功");
              this.$router.push('/light-user');
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      },
      resetForm(formName) {
        this.$router.push('/light-user');
      }
    },
    created() {
      this.fetch()
    }
  }

</script>
<style>
  .el-input .el-input__inner {
    /* width: 300px !important; */
  }

  .el-textarea__inner {
    /* width: 600px !important; */
  }

  .el-radio {
    margin-right: 10px;
  }

</style>
