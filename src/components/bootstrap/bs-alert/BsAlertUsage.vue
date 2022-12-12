<template>
  <div class="component-usage">
    <div>
      <h3>基础用法</h3>
      <BsAlert
        v-for="type in colorTypes"
        :key="type"
        :type="type"
        :title="`这是一个${type}类型的警告框！`"></BsAlert>
    </div>

    <div>
      <hr>
      <h3>可关闭</h3>
      <BsAlert
        title="这是可关闭的警告框！"
        type="primary"
        closeable></BsAlert>
      <BsAlert
        title="这是可关闭的警告框！"
        type="success"
        closeable></BsAlert>
      <BsAlert
        title="这是可关闭的警告框！"
        type="warning"
        closeable></BsAlert>
      <BsAlert
        title="这是可关闭的警告框！"
        type="danger"
        closeable></BsAlert>
    </div>

    <div>
      <hr>
      <h3>自定义关闭按钮</h3>
      <BsAlert
        title="自定义关闭按钮！"
        type="primary"
        closeable
        close-text="知道啦"></BsAlert>

      <BsAlert
        title="超长内容！超长内容！超长内容！超长内容！超长内容！超长内容！超长内容！超长内容！超长内容！超长内容！超长内容！超长内容！"
        type="danger"
        closeable
        close-text="知道啦"></BsAlert>
    </div>

    <div>
      <hr>
      <h3>辅助性文字</h3>
      <BsAlert
        title="网页"
        description="网页是一个包含HTML标签的纯文本文件！"
        type="primary"></BsAlert>

      <BsAlert
        title="自定义辅助性文字"
        type="primary">
        <template #description>
          <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
          <hr>
          <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
        </template>
      </BsAlert>
    </div>

    <div>
      <hr>
      <h3>带图标</h3>
      <BsAlert
        title="这是可关闭的警告框！"
        type="primary"
        icon="info-circle-fill"
        closeable>
        <template #icon>
          <BsiInfoCircleFill></BsiInfoCircleFill>
        </template>
      </BsAlert>
      <BsAlert
        title="一个成功的警告框！"
        type="success"
        icon="check-circle-fill">
        <template #icon>
          <BsiCheckCircleFill></BsiCheckCircleFill>
        </template>
      </BsAlert>
      <BsAlert
        title="一个警告的，可关闭的警告框！"
        icon="exclamation-circle-fill"
        type="warning"
        closeable>
        <template #icon>
          <BsiExclamationCircleFill></BsiExclamationCircleFill>
        </template>
      </BsAlert>
      <BsAlert
        title="很多文字的警告框！很多文字的警告框！很多文字的警告框！很多文字的警告框！很多文字的警告框！很多文字的警告框！很多文字的警告框！"
        icon="exclamation-circle-fill"
        type="info"
        closeable>
        <template #icon>
          <BsiExclamationCircleFill></BsiExclamationCircleFill>
        </template>
      </BsAlert>

      <BsAlert
        title="有辅助性文字！"
        description="哈哈！"
        icon="exclamation-circle-fill"
        type="danger"
        closeable>
        <template #icon>
          <BsiExclamationCircleFill></BsiExclamationCircleFill>
        </template>
      </BsAlert>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import BsAlert from './BsAlert.vue';
import { BsiInfoCircleFill } from 'vue3-bootstrap-icon/es/icons/BsiInfoCircleFill';
import { BsiCheckCircleFill } from 'vue3-bootstrap-icon/es/icons/BsiCheckCircleFill';
import { BsiExclamationCircleFill } from 'vue3-bootstrap-icon/es/icons/BsiExclamationCircleFill';

export default defineComponent({
  name: 'BsAlertUsage',
  components: {
    BsAlert,
    BsiInfoCircleFill,
    BsiCheckCircleFill,
    BsiExclamationCircleFill
  },
  setup () {
    let colorTypes = ref(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']);

    return {
      colorTypes
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  max-width: 600px;
}
</style>
