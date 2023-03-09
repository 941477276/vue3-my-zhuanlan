<template>
<div class="demo-box">
  <div class="demo-box-header">
    <h6 class="demo-title">按钮类型{{ title.cn }}</h6>
    <div class="demo-operate-area">
      <bs-tooltip content="在Playground中打开" placement="top" transition-name="scale">
        <bs-button size="sm">
          <BsiPlayFill></BsiPlayFill>
        </bs-button>
      </bs-tooltip>
      <bs-tooltip content="复制代码" placement="top" transition-name="scale">
        <bs-button size="sm" @click="copyExampleCode">
          <BsiFiles></BsiFiles>
        </bs-button>
      </bs-tooltip>
      <bs-tooltip :content="codeExpanded ? '收起代码' : '展开代码'" placement="top" transition-name="scale">
        <bs-button size="sm" @click="codeExpanded = !codeExpanded"
                   :class="{
                     'example-code-expanded': codeExpanded
                   }">
          <BsiCode></BsiCode>
        </bs-button>
      </bs-tooltip>
    </div>
  </div>
  <div class="demo-description" v-html="description.cn"></div>
  <div class="demo-example">
    <slot>
      <bs-button>default</bs-button>
      <bs-button type="primary">primary</bs-button>
      <bs-button type="secondary">secondary</bs-button>
      <bs-button type="success">success</bs-button>
      <bs-button type="warning">warning</bs-button>
      <bs-button type="danger">danger</bs-button>
      <bs-button type="info">info</bs-button>
      <bs-button type="light">light</bs-button>
      <bs-button type="danger">danger</bs-button>
    </slot>
  </div>
  <div class="demo-example-code" v-show="codeExpanded">
    <pre v-pre>
      这是一段代码
      这是一段代码
      这是一段代码这是一段代码
      这是一段代码
    </pre>
    <div class="shrink-code-operate">
      <bs-button block @click="codeExpanded = false"><BsiChevronUp></BsiChevronUp>收起代码</bs-button>
    </div>
  </div>
</div>
</template>

<script>
import {
  ref,
  defineComponent
} from 'vue';
import { BsiPlayFill } from 'vue3-bootstrap-icon/es/icons/BsiPlayFill';
import { BsiCode } from 'vue3-bootstrap-icon/es/icons/BsiCode';
// import { BsiCodeSlash } from 'vue3-bootstrap-icon/es/icons/BsiCodeSlash';
import { BsiFiles } from 'vue3-bootstrap-icon/es/icons/BsiFiles';
import { BsiChevronUp } from 'vue3-bootstrap-icon/es/icons/BsiChevronUp';
import { copyText } from '../common/utils';
import { BsMessage } from '../../../src/components/bs-message';

export default defineComponent({
  name: 'DemoBox',
  components: {
    BsiPlayFill,
    BsiCode,
    // BsiCodeSlash,
    BsiFiles,
    BsiChevronUp
  },
  props: {
    langCode: { // 语言编码
      type: String,
      default: 'cn'
    },
    title: { // 标题
      type: Object,
      default () {
        return {
          cn: '',
          en: ''
        };
      }
    },
    description: { // 描述
      type: Object,
      default () {
        return {
          cn: '',
          en: ''
        };
      }
    },
    exampleCode: { // 示例代码
      type: String,
      default: ''
    }
  },
  setup () {
    let codeExpanded = ref(false);

    return {
      codeExpanded,
      copyExampleCode () { // 复制代码
        BsMessage.success('代码已复制');
      }
    };
  }
});
</script>

<style lang="scss">
@import "demo-box";
</style>
