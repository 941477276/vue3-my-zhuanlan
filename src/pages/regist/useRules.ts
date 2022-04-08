export default {
  nickName: [
    { type: 'string', required: true, message: '请输入昵称！', trigger: ['input', 'blur'], whitespace: true }
  ],
  email: [
    { required: true, message: '请输入邮箱！', trigger: ['input', 'blur'], whitespace: true },
    { pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/, message: '请输入正确对邮箱！', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入登陆密码！', trigger: 'input', whitespace: true },
    { pattern: /[\w\-\,\.\\/!@#\$%\^&\*]{6,20}/, message: '密码为6-20位的英文字母、数字、_和特殊字符组成！', trigger: 'input' }
  ]
};
