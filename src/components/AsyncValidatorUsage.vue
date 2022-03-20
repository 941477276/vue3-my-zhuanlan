<template>
  <div class="async-validator-usage">
    <h1>async-validator</h1>
  </div>
</template>

<script>
// 使用文档：https://blog.csdn.net/dreamingbaobei3/article/details/122727229
// https://www.npmjs.com/package/async-validator
// https://zhuanlan.zhihu.com/p/269624748
import Schema from 'async-validator';
export default {
  name: 'AsyncValidatorUsage',
  setup (prop) {
    let descriptor = { // 字段规则
      username: [
        { type: 'string', required: true, message: '请输入用户名' },
        { type: 'string', min: 4, message: '用户名最少需要4个字符' }
      ]
    };
    let validator = new Schema(descriptor); // 创建校验器
    console.log(validator);
    validator.validate({ username: '哈哈' }, (errors, fields) => {
      console.log('错误：', errors);
      console.log('字段：', fields);
    });

    return {

    };
  }
};
</script>

<style scoped>

</style>
