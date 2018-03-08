<template>
    <div class="resetPass">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="旧密码" prop="old_password">
                <el-input type="password" placeholder="请输入您的新密码" v-model="ruleForm.old_password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
                <el-input type="password" placeholder="请输入您的新密码" v-model="ruleForm.pass"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" placeholder="请再次输入您的新密码" v-model="ruleForm.checkPass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import Interface from '@/util/interface'
    import qs from 'qs'
    export default {
        data() {
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
                },
                rules: {
                    old_password: [
                        {required: true, message: '请输入您的旧密码', trigger: 'blur'},
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
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            old_password: this.ruleForm.old_password,
                            new_password: this.ruleForm.pass
                        };
                        this.axios.defaults.withCredentials = true;
                        this.axios.post(
                                Interface.user.modifyPassword,qs.stringify(params)
                        ).then((res) => {
                            this.loading = false;
                            if (res.data.code == 200) {
                                this.$notify.success({
                                    title: '成功',
                                    message: '修改成功'
                                });
                            } else {
                                this.$notify.error({
                                    title: '失败',
                                    message: '修改失败'
                                });
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*@import "./sass/login.scss";*/
</style>
