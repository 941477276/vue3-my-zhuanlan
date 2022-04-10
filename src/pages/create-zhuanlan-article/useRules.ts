export default {
  email: [
    { required: true, message: '请输入文章标题！', trigger: ['input', 'blur'], whitespace: true }
  ],
  content: [
    { required: true, message: '请输入文章内容！', trigger: ['input', 'blur'], whitespace: true }
  ]
};
