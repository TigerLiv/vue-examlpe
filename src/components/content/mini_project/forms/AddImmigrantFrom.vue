<template>
  <div class="container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <div v-for="(item,index) in topics" class="topics">
      <!-- <div> -->
      <div>
        <span>{{item.title}} ——</span>
        <span>{{item.is_required == '0'?'选填题':'必填题'}} ——</span>
        <span>{{item.question_type == '1'?'单选':'多选'}}</span>
        <span v-if="item.question_type == '2'">{{item.select_num_min}}-{{item.select_num_max}}个</span>——
        <span>{{item.weight}}%</span>
      </div>
      <el-tag v-if="sub.delete_flag == 0" v-for="sub in item.question_select" :key="parseInt(sub.id)">{{sub.title}}</el-tag>
      <!-- </div> -->
      <div style="float:right;margin-top:-10px">
        <el-button type="text" @click="edit('edit',item,index)">编辑</el-button>
        <el-button type="text" @click="edit('upIndex',{item, index})">上移</el-button>
        <el-button type="text" @click="edit('downIndex',{item, index})">下移</el-button>
      </div>
    </div>
    <el-button type="text" @click="add" class="add_select">添加选项</el-button>
    <el-form :model="form" ref="form" label-width="120px" class="demo-ruleForm">
      <el-form-item label="题干" prop="title" :rules="[{ required: true, message: '请输入题干', trigger: 'blur' },]">
        <el-input v-model="form.title" placeholder="输入题干" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item v-if="item.delete_flag == 0" v-for="(item,index) in form.question_select" :label="'选项' + index" :key="item.key"
        :prop="'question_select.' + index + '.title'" :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">
        <el-input v-model="item.title" placeholder="输入选项" style="width:200px;"></el-input>
        <el-button @click.prevent="removeDomain(item)">删除</el-button>
      </el-form-item>
      <el-form-item label="匹配短语" prop="annotation" :rules="[{ required: true, message: '请输入匹配短语', trigger: 'blur' },]">
        <el-input v-model="form.annotation" placeholder="输入匹配短语" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="比重设置" prop="weight" :rules="[{ required: true, message: '请设置此题比重', trigger: 'change' },]">
        <el-input-number size="medium" v-model="form.weight" :min="0" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="题目类型" prop="is_required" :rules="[{ required: true, message: '请选择题目类型', trigger: 'change' },]">
        <el-radio-group v-model="form.is_required">
          <el-radio :label="0">选填题</el-radio>
          <el-radio :label="1">必选题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题目选项" prop="question_type" :rules="[{ required: true, message: '请选择题目选项', trigger: 'change' },]">
        <el-radio-group v-model="form.question_type">
          <el-radio :label="1">单选</el-radio>
          <el-radio :label="2">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.question_type == '2'" label="最多选择数量" prop="select_num_max" :rules="[{ required: true, message: '请设置此题最多选择数量', trigger: 'change' },]">
        <el-input-number size="medium" v-model="form.select_num_max" :min="0" :max="5"></el-input-number>
      </el-form-item>
      <el-form-item v-if="form.question_type == '2'" label="最少选择数量" prop="select_num_min" :rules="[{ required: true, message: '请设置此题最少选择数量', trigger: 'change' },]">
        <el-input-number size="medium" v-model="form.select_num_min" :min="0" :max="5"></el-input-number>
      </el-form-item>
      <el-form-item>

        <el-button type="text" @click="cancel('form')">取消</el-button>
        <el-button type="text" @click="save('question','form')" :disabled="btnDisabled">完成</el-button>
      </el-form-item>
    </el-form>
    <el-col style="text-align:center">
      <el-button type="primary" @click="save('done')">提交</el-button>
    </el-col>
  </div>
</template>
<script>
  import Interface from '@/util/interface'
  import $ from 'jquery'
  let form = {}
  export default {
    data() {
      return {
        btnDisabled: false,
        handle: true,
        type: '',
        topics: [],
        form: {
          title: '',
          question_select: [{
            title: '',
            question_id: '',
            delete_flag: 0
          }],
          priority: 0,
          question_type: '',
          is_required: '',
          weight: '',
          select_num_min: 0,
          select_num_max: 0
        },
        handleStatus: true,
        topIndex: '',
        loading: true,
        num: 0,
      }
    },
    methods: {
      fetch() {
        Interface.getData('get', Interface.form.get + '/' + this.$route.params.id).then(res => {
          if (res.data.code == 200) {
            this.loading = false
            let data = res.data.data
            this.topics = data.questions
          }
        })
      },
      save(scence, formName) {
        if ('question' == scence) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let obj = {}
              obj = Interface.cloneObj(this.form)
              // obj.priority += 1;
              obj.form_id = parseInt(this.$route.params.id);
              obj.delete_flag = 0
              if (this.handleStatus) {
                this.topics.push(obj)
              } else {
                this.topics.splice(this.topIndex, 1, obj)
                this.handleStatus = true
              }
              //清空form表单
              this.$refs[formName].resetFields();
              Object.assign(this.form, this.$options.data().form)
            }
          })
        } else if ('done' == scence) {
          let string = '',
            str = ''
          let subString = ''
          //将所有的问题拼成接口要求的字符串格式
          const arr = [...this.topics]
          arr.forEach((elem, index) => {
            for (let item in elem) {
              string = JSON.stringify(elem)
            }
            str += string
            if (index < this.topics.length - 1) {
              str += ','
            }
          })
          let params = {
            form_id: this.$route.params.id,
            data: `[${str}]`
          }
          Interface.getData('post', Interface.form.add_question, params).then(res => {
            if (res.data.code == 200) {
              this.$message.success('成功！')
              this.$router.go(-1)
            } else {
              this.$message.error('失败！')
            }
          })
        }

      },
      confirm(scence, params, confirmText) {
        if ('showConfirm' == scence) {
          return this.$confirm(params, '提示', {
            confirmButtonText: confirmText ? confirmText : '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
      },
      removeDomain(item) {
        var index = this.form.question_select.indexOf(item)
        if (index !== -1) {
          this.form.question_select[index].delete_flag = 1
        }
      },
      add() {
        this.form.question_select.push({
          title: '',
          question_id: '',
          delete_flag: 0
        });
      },
      edit(scence, params, index) {
        if ('edit' == scence) {
          this.topIndex = index
          this.handleStatus = false
          this.form = Interface.cloneObj(params)
          $('.el-main').scrollTop($('.container').height())
        } else if ('upIndex' == scence) {
          let item = params.item;
          let index = params.index;
          if (index == 0) {
            this.$message.info('当前是第一个，不能上移！')
          } else {
            let obj = Interface.cloneObj(this.topics[index]);
            this.topics.splice(index, 1);
            this.topics.splice(index - 1, 0, obj);
            this.$set(this.topics[index - 1], 'priority', index)
            this.$set(this.topics[index], 'priority', index + 1)

          }
        } else if ('downIndex' == scence) {
          let item = params.item;
          let index = params.index;
          if (index == this.topics.length - 1) {
            this.$message.info('当前是最后一个，不能下移！')
          } else {
            let obj = Interface.cloneObj(this.topics[index]);
            this.topics.splice(index, 1);
            this.topics.splice(index + 1, 0, obj);
            this.$set(this.topics[index + 1], 'priority', index)
            this.$set(this.topics[index], 'priority', index - 1)
          }
        }
      },
      changeValue(value) {},
      cancel(formName) {
        this.$router.go(-1)
      },
    },
    mounted() {},
    created() {
      this.fetch()
    },
  }

</script>
<style lang="scss">
  .topics {
    margin-bottom: 20px;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 10px;
    &_sub {
      float: left;
    }
  }

  .add_select {
    position: relative;
    top: 102px;
    left: 450px;
    z-index: 100;
  }

  .el-tag {
    margin-top: 10px;
    margin-left: 8px;
  }

</style>
