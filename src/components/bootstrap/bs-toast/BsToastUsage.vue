<template>
<div class="component-usage">
  <div>
    <h3>基本使用</h3>
    <bs-button type="primary" @click="showToast">点我显示</bs-button>
  </div>
  <div>
    <hr>
    <h3>不同类型</h3>

    <bs-button type="" @click="showToast1('')">默认类型（无类型）</bs-button>
    <bs-button type="primary" @click="showToast1('primary')">primary</bs-button>
    <bs-button type="secondary" @click="showToast1('secondary')">secondary</bs-button>

    <bs-button type="success" @click="showToast1('success')">success</bs-button>
    <bs-button type="danger" @click="showToast1('danger')">danger</bs-button>
    <bs-button type="warning" @click="showToast1('warning')">warning</bs-button>

    <bs-button type="info" @click="showToast1('info')">info</bs-button>
    <bs-button type="light" @click="showToast1('light')">light</bs-button>
    <bs-button type="dark" @click="showToast1('dark')">dark</bs-button>
  </div>

  <div>
    <hr>
    <h3>不同显示位置</h3>
    <div>
      <bs-button type="primary" @click="showToast2('top-left')">top-left</bs-button>
      <bs-button type="primary" @click="showToast2( 'top-right')">top-right</bs-button>
      <bs-button type="primary" @click="showToast2( 'top-center')">top-center</bs-button>
    </div>
    <div style="margin-top: 1rem;">
      <bs-button type="primary" @click="showToast2( 'bottom-left')">bottom-left</bs-button>
      <bs-button type="primary" @click="showToast2( 'bottom-right')">bottom-right</bs-button>
      <bs-button type="primary" @click="showToast2( 'bottom-center')">bottom-center</bs-button>
    </div>
  </div>

  <div>
    <hr>
    <h3>静态的</h3>
    <div class="static-toast-container">
      <bs-button type="primary" @click="showStaticToast">{{ staticToastVisible ? '隐藏' : '显示' }}静态Toast</bs-button>
      <bs-toast
        id="staticToast"
        title="静态Toast"
        style="margin-top: 1rem;"
        :duration="0"
        @hide="staticToastVisible = false"
        @show="staticToastVisible = true">
        这是一个 <strong style="font-size: 1.2rem;">静态的</strong> 轻提示！
      </bs-toast>
    </div>
  </div>

  <div>
    <hr>
    <h3>自定义标题与内容</h3>
    <bs-button type="primary" @click="customTitle">自定义标题与内容</bs-button>
    <bs-button type="primary" @click="showSecondaryTitle">显示副标题</bs-button>
    <bs-button type="primary" @click="dynamicTitle">动态标题</bs-button>
    <bs-button type="primary" @click="useDangerouslyHTML">内容使用HTML片段</bs-button>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  h,
  createVNode
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
} from '@/common/bs-util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imgSrc = require('@/assets/imgs/icons-hero.png');

export default defineComponent({
  name: 'BsToastUsage',
  components: {
    // BsToastCom
  },
  setup (props: any) {
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
    let staticToastVisible = ref(false);
    let timeNow = ref('');
    let timer = setInterval(function () {
      timeNow.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
    return {
      showToast () {
        BsToast({
          title: 'bootstrap toast',
          message: '这是一个轻提示！'
        });
      },
      showToast1 (type: string) {
        BsToast({
          type,
          title: !type ? '默认类型（无类型）' : `【${type}】`,
          message: `这是一个【${!type ? '默认类型（无类型）' : type}】的轻提示！`
        });
      },
      showToast2,

      staticToastVisible,
      showStaticToast () {
        if (!staticToastVisible.value) {
          BsToast.show('staticToast');
        } else {
          BsToast.hide('staticToast');
        }
      },

      customTitle () {
        BsToast({
          type: 'primary',
          title: h('div', { className: 'custom-title' }, [
            h('img', {
              src: imgSrc,
              style: 'display: inline-block;width: 40px;height: 30px'
            }),
            h('h5', {
              style: 'display: inline-block;text-align: vertical;color: #fff;'
            }, '自定义标题')
          ]),
          message: h('div', [
            h('mark', {
              style: 'padding: 0.5rem;font-size: 1.2rem;font-weight: bold;'
            }, '自定义'),
            '的Toast内容！'
          ])
        });
      },
      showSecondaryTitle () {
        var toastCtx = BsToast({
          type: 'info',
          title: '消息通知',
          placement: 'bottom-right',
          duration: 0,
          secondaryTitle: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          message: h('div', [
            '您有',
            h('strong', {
              style: 'color: #f00;'
            }, '99+'),
            '条消息待阅读！'
          ]),
          onClick () {
            alert('点击了Toast, Toast即将关闭！');
            toastCtx?.hide();
          }
        });
      },
      timeNow,
      dynamicTitle () {
        BsToast({
          type: 'primary',
          title: timeNow,
          duration: 0,
          secondaryTitle: '当前时间',
          message: timeNow
        });
      },
      useDangerouslyHTML () {
        BsToast({
          type: 'warning',
          title: '使用HTML片段',
          duration: 0,
          secondaryTitle: '（危险）',
          dangerouslyUseHTMLString: true,
          message: `设置<strong><code>dangerouslyUseHTMLString=true</code></strong>即可使用HTML片段来渲染内容
                    <p style="color: #DC3545;">这是一种危险行为哦~</p>`
        });
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-button + .bs-button{
  margin-left: 1rem;
}
.static-toast-container{
  padding: 20px;
  height: 180px;
  max-width: 600px;
  background-color: #343A40;
}
</style>
