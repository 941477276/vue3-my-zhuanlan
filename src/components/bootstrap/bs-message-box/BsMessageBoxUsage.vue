<template>
<div class="component-usage">
  <div>
    <h2>基本使用</h2>
    <bs-button type="primary" @click="showMessageBox1">点我显示</bs-button>
    <hr>
  </div>

  <div>
    <h2>不同类型</h2>
    <bs-button type="primary" @click="showMessageBox2('info')">Info</bs-button>
    <bs-button type="success" style="margin-left: 15px" @click="showMessageBox2('success')">Success</bs-button>
    <bs-button type="warning" style="margin-left: 15px" @click="showMessageBox2('warning')">Warning</bs-button>
    <bs-button type="danger" style="margin-left: 15px" @click="showMessageBox2('danger')">Danger</bs-button>
    <bs-button type="info" style="margin-left: 15px" @click="showMessageBox2('prompt')">Prompt（提交内容）</bs-button>
    <hr>
  </div>

  <div>
    <h2>延迟关闭</h2>
    <bs-button type="primary" @click="showMessageBox3">延迟3s关闭</bs-button>
    <hr>
  </div>

  <div style="display: none;">
    <h2>基础样式</h2>
    <h4>1、UI样式</h4>
    <bs-message-box
      style="position: static;display: inline-block; padding: 30px; background-color: rgba(0,0,0,0.2);"
      title="温馨提示"
      message="一个消息盒子！">
      消息盒子内容！
    </bs-message-box>

    <hr>
    <h4>2、弹窗样式</h4>
    <bs-message-box
      style="position: static;display: inline-block; padding: 30px; background-color: rgba(0,0,0,0.2);"
      title="弹窗样式的温馨提示"
      :dialog-theme="true"
      :show-close="true">
      一个弹窗样式消息盒子！
    </bs-message-box>

    <hr>
    <h4>3、没有图标</h4>
    <bs-message-box
      style="position: static;display: inline-block; padding: 30px; background-color: rgba(0,0,0,0.2);"
      title="没有图标的消息盒子"
      :dialog-theme="true"
      :show-close="true"
      :show-icon="false">
      一个弹窗样式消息盒子！
    </bs-message-box>

    <hr>
    <h4>4、提交内容(prompt)</h4>
    <bs-message-box
      style="position: static;display: inline-block; padding: 30px; background-color: rgba(0,0,0,0.2);"
      title="没有图标的消息盒子"
      type="prompt"
      :input-rules="[
      {required: true, message: '请输入你的邮箱', whitespace: true, trigger: ['input', 'blur']},
      {pattern: /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/, message: '邮箱格式输入不正确', whitespace: true, trigger: ['input', 'blur']}
    ]"
      :ok-loading="false"
      input-label="你的邮箱"
      input-placeholder="请输入你的邮箱"
      :dialog-theme="false">
      一个弹窗样式消息盒子！
    </bs-message-box>
  </div>

</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';
import BsMessageBoxCom from '@/components/bootstrap/bs-message-box/BsMessageBox.vue';
import { BsMessageBox } from '@/components/bootstrap/bs-message-box/bs-message-box';
import {
  MessageBoxType
} from '@/ts-tokens/bootstrap/message';

export default defineComponent({
  name: 'BsMessageBoxUsage',
  components: {
    BsMessageBox: BsMessageBoxCom
  },

  setup () {
    let showMessageBox1 = function () {
      BsMessageBox({
        title: '温馨提示',
        message: '一条普通消息！'
      });
    };

    let showMessageBox2 = function (typeName: MessageBoxType) {
      BsMessageBox[typeName]?.({
        title: '温馨提示',
        message: `一条${typeName}消息！`
      });
    };

    let showMessageBox3 = function () {
      BsMessageBox({
        title: '温馨提示',
        type: 'warning',
        message: '确定要删除吗？',
        onOk () {
          return new Promise(resolve => {
            setTimeout(function () {
              resolve(1);
            }, 3000);
          });
        }
      });
    };

    return {
      showMessageBox1,
      showMessageBox2,
      showMessageBox3
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
