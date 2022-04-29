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

  <div>
    <h2>弹窗样式</h2>
    <bs-button type="primary" @click="showMessageBox4">点我显示</bs-button>
    <bs-button type="info" style="margin-left: 15px" @click="showMessageBox5">Prompt（提交内容）</bs-button>
    <hr>
  </div>

  <div>
    <h2>自定义标题、图标、内容</h2>
    <div style="text-align: center;">
      <bs-button type="primary" @click="showMessageBox6">自定义标题</bs-button>
      <bs-button type="primary" style="margin-left: 15px" @click="showMessageBox7">自定义图标</bs-button>
      <bs-button type="primary" style="margin-left: 15px" @click="showMessageBox8">自定义内容</bs-button>
      <bs-button type="primary" style="margin-left: 15px" @click="showMessageBox9">自定义内容（使用HTML片段）</bs-button>
    </div>
    <hr>
  </div>

  <div>
    <h2>居中显示</h2>
    <div style="text-align: center;">
      <bs-button type="primary" @click="showMessageBox10">居中显示</bs-button>
    </div>
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
  ref,
  h
} from 'vue';
import BsMessageBoxCom from '@/components/bootstrap/bs-message-box/BsMessageBox.vue';
// import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';
import { BsMessageBox } from '@/components/bootstrap/bs-message-box/bs-message-box';
import {
  MessageBoxType
} from '@/ts-tokens/bootstrap/message';
import { BsMessage } from '@/components/bootstrap/bs-message';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imgSrc = require('@/assets/imgs/icons-hero.png');

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
      if (typeName === 'prompt') {
        BsMessageBox[typeName]?.({
          title: '绑定邮箱',
          inputPlaceholder: '请输入您的邮箱',
          inputLabel: '您的邮箱',
          inputRules: [
            { required: true, message: '请输入你的邮箱', whitespace: true, trigger: ['input', 'blur'] },
            { pattern: /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/, message: '邮箱格式输入不正确', whitespace: true, trigger: ['input', 'blur'] }
          ],
          onOk () {
            return new Promise(function (resolve) {
              setTimeout(function () {
                resolve(true);
                BsMessage.success?.('邮箱绑定成功！');
              }, 1500);
            });
          }
        });
        return;
      }
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

    let showMessageBox4 = function () {
      BsMessageBox({
        title: '提示',
        message: '这是一个弹窗样式的消息盒子！',
        dialogTheme: true
      });
    };

    let showMessageBox5 = function () {
      BsMessageBox({
        title: '绑定邮箱',
        type: 'prompt',
        dialogTheme: true
      });
    };

    let showMessageBox6 = function () {
      BsMessageBox({
        title: h('strong', ['这是一个加粗的标题，而且还', h('small', h('mark', '加黄'))]),
        message: '这个标题你喜欢吗？',
        dialogTheme: true
      });
    };

    let showMessageBox7 = function () {
      BsMessageBox({
        title: '自定义图标',
        icon: h('img', {
          src: imgSrc,
          style: {
            width: '50px'
            // height: '64px'
          }
        }),
        message: '不要看我，看左边的图标！'
      });
    };

    let showMessageBox8 = function () {
      BsMessageBox({
        title: '自定义内容，请看下面的内容！',
        message: h('div', [
          h('h3', '日出东方催人醒'),
          h('h3', [
            '不及晚',
            h('strong', ' 霞'),
            h('mark', {
              style: {
                padding: '0 .5rem',
                fontSize: '1.2em'
              }
            }, 'in'),
            '我心'
          ])
        ])
      });
    };

    let showMessageBox9 = function () {
      BsMessageBox({
        title: '自定义内容，请看下面的内容！',
        dangerouslyUseHTMLString: true,
        message: `<div>
                    <h3>日出东方催人醒</h3>
                    <h3>不及晚<strong> 霞</strong><mark style="padding: 0 .5rem;font-size:1.2em;">in</mark>我心</h3>
                  </div>`
      });
    };

    let showMessageBox10 = function () {
      BsMessageBox({
        title: '温馨提示',
        centered: true,
        message: '看，消息盒子水平，垂直方向都是居中的！'
      });
    };

    return {
      showMessageBox1,
      showMessageBox2,
      showMessageBox3,
      showMessageBox4,
      showMessageBox5,
      showMessageBox6,
      showMessageBox7,
      showMessageBox8,
      showMessageBox9,
      showMessageBox10
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
