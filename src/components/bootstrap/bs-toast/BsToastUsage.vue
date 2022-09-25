<template>
<div class="component-usage">
  <div>
    <bs-button type="primary" @click="showToast1('toast1')">显示轻提示</bs-button>
    <div style="margin: 1rem;">
      <bs-button type="primary" @click="showToast1('top-left')">top-left</bs-button>
      <bs-button type="primary" @click="showToast1('top-right')">top-right</bs-button>
      <bs-button type="primary" @click="showToast1('top-center')">top-center</bs-button>
    </div>
    <div style="margin: 1rem;">
      <bs-button type="primary" @click="showToast1('bottom-left')">bottom-left</bs-button>
      <bs-button type="primary" @click="showToast1('bottom-right')">bottom-right</bs-button>
      <bs-button type="primary" @click="showToast1('bottom-center')">bottom-center</bs-button>
    </div>
    <BsToastCom type="success" id="toast1">
      <template #header>
        <!--<img width="20px" height="20px" src="https://p3-sign.bdxiguaimg.com/tos-cn-i-0004/18afff332d8b42b1b187d886d9c23c7c~tplv-pk90l89vgd-crop-center:864:486.avif?x-expires=1695471878&x-signature=51kjbHfGg1EUycVbib7pmMxwppI%3D" class="rounded mr-2" alt="...">-->
        <strong class="mr-auto">Bootstrap!</strong>
        <small>11 mins ago</small>
      </template>
      轻提示内容
    </BsToastCom>

    <BsToastCom
      type="success"
      fixed
      id="top-left"
      placement="top-left"
      title="top-left"
      @click="showToast1('top-left')">
      轻提示内容
    </BsToastCom>

    <BsToastCom
      type="success"
      fixed
      id="top-right"
      placement="top-right"
      title="top-right"
      @click="showToast1('top-right')">
      轻提示内容
    </BsToastCom>

    <BsToastCom
      type="success"
      fixed
      id="bottom-right"
      placement="bottom-right"
      title="bottom-right"
      @click="showToast1('bottom-right')">
      轻提示内容
    </BsToastCom>

    <BsToastCom
      type="success"
      fixed
      id="bottom-left"
      placement="bottom-left"
      title="bottom-left"
      @click="showToast1('bottom-left')">
      轻提示内容
    </BsToastCom>

    <BsToastCom
      type="success"
      fixed
      id="top-center"
      placement="top-center"
      title="top-center"
      @click="showToast1('top-center')">
      轻提示内容
    </BsToastCom>

    <BsToastCom
      type="success"
      fixed
      id="bottom-center"
      placement="bottom-center"
      title="bottom-center"
      @click="showToast1('bottom-center')">
      轻提示内容
    </BsToastCom>
  </div>

  <div>
    <hr>
    <div style="margin: 1rem;">
      <bs-button type="primary" @click="showToast2('top-left')">top-left</bs-button>
      <bs-button type="primary" @click="showToast2( 'top-right')">top-right</bs-button>
      <bs-button type="primary" @click="showToast2( 'top-center')">top-center</bs-button>
    </div>
    <div style="margin: 1rem;">
      <bs-button type="primary" @click="showToast2( 'bottom-left')">bottom-left</bs-button>
      <bs-button type="primary" @click="showToast2( 'bottom-right')">bottom-right</bs-button>
      <bs-button type="primary" @click="showToast2( 'bottom-center')">bottom-center</bs-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import {
  BsToast
} from './bs-toast';
import BsToastCom from './BsToast.vue';
import dayjs from 'dayjs';
import {
  supportedBsColorTypes
} from '@/ts-tokens/bootstrap';
import {
  getRandomNumber
} from '@/common/util';

export default defineComponent({
  name: 'BsToastUsage',
  components: {
    BsToastCom
  },
  setup (props: any) {
    let showToast1 = function (id: string) {
      BsToast.show(id);
    };
    let showToast2 = function (placement: string) {
      let type = supportedBsColorTypes[getRandomNumber(0, supportedBsColorTypes.length - 1)];
      console.log('type', type);
      BsToast({
        title: placement,
        type,
        secondaryTitle: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        message: `这是一个显示方位为【${placement}】的toast！`,
        placement
      });
    };
    return {
      showToast1,
      showToast2
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-button + .bs-button{
  margin-left: 1rem;
}
</style>
