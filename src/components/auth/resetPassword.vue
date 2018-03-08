<template>
	<div class="login">
		<div class="topbar">
			<h1 class="login-title">重置密码页面</h1>
		</div>
		<section class="login-page">
		    <div class="login-form">
		        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				    <el-form-item label="新密码" prop="pass">
				        <el-input type="password" placeholder="请输入您的新密码" v-model="ruleForm.pass"></el-input>
				    </el-form-item>
				    <el-form-item label="确认密码" prop="checkPass">
				        <el-input type="password" placeholder="请再次输入您的新密码" v-model="ruleForm.checkPass"></el-input>
				    </el-form-item>
				    <el-form-item label="手机号" prop="u_tel">
				        <el-input placeholder="请输入您的手机号" v-model="ruleForm.u_tel"></el-input>
				    </el-form-item>
				    <el-form-item label="短信验证码" prop="v_code">
				        <el-input placeholder="验证码" v-model="ruleForm.v_code"></el-input>
				        <el-button @click = "sendVerify">发送验证码</el-button>
				    </el-form-item>
				    <el-form-item>
				        <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">保存</el-button>
				    </el-form-item>
				</el-form>
		    </div>
	   </section>
	</div>
</template>
<script>
   import Interface from '@/util/interface'
    import qs from 'qs'
    export default {
        data() {
        	//声明两个函数（callback为回调函数）
		    var validatePass = (rule, value, callback) => {
		        if (value === '') {
		            callback(new Error('请输入密码'));
		        } else {
		            if (this.ruleForm.checkPass !== '') {
		                this.$refs.ruleForm.validateField('checkPass');
		            }
		            callback();
		        }
		    };
		    var validatePass2 = (rule, value, callback) => {
		        if (value === '') {
		            callback(new Error('请再次输入密码'));
		        } else if (value !== this.ruleForm.pass) {
		            callback(new Error('两次输入密码不一致!'));
		        } else {
		            callback();
		        }
		    };
		    return {
		        loading: false,
		        ruleForm: {
		            old_password: '',
		            pass: '',
		            checkPass: '',
		            u_tel: '',
		            v_code: ''
		        },
		        rules: {
		            u_tel: [
		                {required: true, message: '请输入您的手机号', trigger: 'blur'},
		            ],
		            v_code: [
		                {required: true, message: '请获取验证码', trigger: 'blur'},
		            ],
		            pass: [
		                {required: true,validator: validatePass, trigger: 'blur'},
		            ],
		            checkPass: [
		                {required: true, validator: validatePass2, trigger: 'blur'},
		            ]
		        }
		    };
		},
        methods: {
        	//提交的方法在elementui中会有
		    submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		            if (valid) {
		                this.loading = true;
		                let params = {
		                    u_password: this.ruleForm.pass,
		                    v_verify: this.ruleForm.v_code,
		                    u_tel: this.ruleForm.u_tel
		                };
		                //请求接口，将数据提交（qs之后是将数据转换的意思）
		                this.axios.post(
		                        Interface.user.reset_pass,qs.stringify(params)
		                ).then((res) => {
		                    if (res.data.code == 200) {
		                        this.loading = false;
		                        this.$message({
		                            showClose: true,
		                            message: '修改成功',
		                            type: 'success'
		                        });
		                    }
		                })
		            }
		        });
		    },
		    sendVerify () {
		        if (this.ruleForm.u_tel == '') {
		            this.$notify.error({
		                title: '错误',
		                message: '您还没有输入手机号'
		            });
		        } else {
		            let params = {
		                u_tel: this.ruleForm.u_tel
		            }
		            this.axios.post(
		                    Interface.user.sendVerify,qs.stringify(params)
		            ).then((res) => {
		                if (res.data.code == 200) {
		                    this.$notify.success({
		                        title: '成功',
		                        message: '验证码已经发送至您的手机'
		                    });
		                }
		            })
		        }
		    }
		}
    }
</script>

<style scoped>

</style>
