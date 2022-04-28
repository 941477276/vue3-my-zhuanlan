<template>
<div
  v-show="visible"
  class="bs-message-box-root"
  :class="[
    {
      'bs-message-box-centered': centered
    },
    customClass
  ]"
  :style="{
    zIndex
  }"
  role="dialog"
  aria-modal="true"
  :aria-label="typeof title === 'function' ? title() : title"
  :data-id="id"
  @click="messageBoxRootClick">
  <transition
    name="scale"
    @after-enter="$emit('show')"
    @after-leave="$emit('hide')">
    <div
      v-show="visible"
      class="bs-message-box"
      :class="[
        {
          'theme-dialog': dialogTheme
        },
        `bs-message-box-${type}`
      ]"
      :style="{
        width: width,
        maxWidth: maxWidth
      }">
      <div
        v-if="dialogTheme"
        class="bs-message-box-header"
        :class="{
          'has-close': showClose
        }">
        <div class="bs-message-box-title">
          {{ typeof title === 'function' ? title() : title }}
        </div>

        <bs-button class="bs-message-box-close" type="link" aria-label="close" @click.stop="hide">
          <span>×</span>
        </bs-button>
      </div>
      <div class="bs-message-box-body">
        <template v-if="type !== 'prompt'">
          <span
            v-if="showIcon"
            class="bs-message-box-icon">
            <slot name="icon">
              <BsIcon :name="iconName"></BsIcon>
            </slot>
          </span>
          <div class="bs-message-box-content-wrap">
            <div class="bs-message-box-title" v-if="!dialogTheme">
              <slot name="title">{{ typeof title === 'function' ? title() : title }}</slot>
            </div>
            <div class="bs-message-box-content">
              <slot>
                <div v-if="dangerouslyUseHTMLString" v-html="message"></div>
                <template v-else>{{ message }}</template>
              </slot>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="bs-message-box-content-wrap">
            <div class="bs-message-box-title" v-if="!dialogTheme">
              <slot name="title">{{ typeof title === 'function' ? title() : title }}</slot>
            </div>
            <BsFormItem
              ref="formItemRef"
              :value="inputModelVal"
              :label="inputLabel"
              :rules="inputRules">
              <BsInput
                v-model="inputModelVal"
                v-bind="inputProps"
                :type="inputType"
                :placeholder="inputPlaceholder"></BsInput>
            </BsFormItem>
          </div>
        </template>
      </div>
      <div class="bs-message-box-btns">
        <bs-button
          v-if="showCancelButton"
          type="primary"
          :size="cancelSize"
          plain
          @click.stop="cancelClick">{{ cancelText }}</bs-button>
        <bs-button
          v-if="showOkButton"
          :type="okType"
          :size="okSize"
          :loading="okLoadingInner"
          :disabled="okLoadingInner || okDisabled"
          @click.stop="okClick">{{ okText }}</bs-button>
      </div>
    </div>
  </transition>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  Component,
  onMounted
} from 'vue';
import BsButton from '../bs-button/BsButton.vue';
import BsIcon from '../bs-icon/BsIcon.vue';
import BsInput from '../bs-input/BsInput.vue';
import BsFormItem from '../bs-form/widgets/BsFormItem.vue';
import { bsMessageBoxProps } from './bs-message-box-props';
import { MessageType } from '@/ts-tokens/bootstrap/message';
// import { useVisible } from './useVisible';
import { useButtonClick } from './useButtonClick';
import { util } from '@/common/util';

const defaultIconMap: Record<MessageType, string> = {
  info: 'info-circle-fill',
  success: 'check-circle-fill',
  warning: 'exclamation-circle-fill',
  danger: 'x-circle-fill'
};
let messageBoxCount = 0;
export default defineComponent({
  name: 'BsMessageBox',
  components: {
    BsButton,
    BsIcon,
    BsInput,
    BsFormItem
  },
  props: bsMessageBoxProps,
  emits: ['show', 'hide'],
  setup (props: any) {
    let id = props.id || `bs_message_box-${++messageBoxCount}`;
    let iconName = computed(function () {
      if (props.icon) {
        return props.icon;
      }
      return defaultIconMap[props.type as MessageType] || defaultIconMap.info;
    });

    let formItemRef = ref<Component|null>(null);

    // 执行隐藏
    let doHide = function () {
      let okCloseResult = typeof props.onCancel === 'function' ? props.onCancel() : true;
      if (okCloseResult === false) {
        return;
      }
      if (util.isPromise(okCloseResult)) {
        okCloseResult.then(() => {
          visible.value = false;
          console.log('关闭message box！');
        });
      } else {
        visible.value = false;
        console.log('关闭message box！');
      }
    };

    // 处理显示与隐藏
    // let { visible, hide, show } = useVisible(props);

    // 确定、取消按钮的点击事件
    let { okClick, cancelClick, okLoadingInner, inputModelVal } = useButtonClick(props, formItemRef, doHide);

    let visible = ref(false);

    // 显示
    let show = function () {
      visible.value = true;
    };
    // 隐藏
    let hide = function () {
      if (okLoadingInner.value) {
        return;
      }
      doHide();
    };

    // 遮罩点击
    let messageBoxRootClick = function () {
      if (props.closeOnClickModal) {
        hide();
      }
    };

    onMounted(function () {
      show();
    });

    return {
      iconName,
      id,
      formItemRef,
      visible,
      okLoadingInner,
      inputModelVal,

      hide,
      okClick,
      cancelClick,
      messageBoxRootClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-message-box";
</style>
