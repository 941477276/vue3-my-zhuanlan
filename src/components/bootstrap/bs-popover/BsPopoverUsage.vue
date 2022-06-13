<template>
  <div class="component-usage">
    <div>
      <h3>基础用法</h3>
      <bs-popover
        title="Popover title"
        content="And here's some amazing content. It's very engaging. Right?">
        <bs-button type="primary" plain>Popover</bs-button>
      </bs-popover>
    </div>

    <div>
      <hr>
      <h3>不同方向</h3>
      <div class="directions-box">
        <div class="direction-top">
          <bs-popover placement="top-start" title="top-start" content="popover显示位置：top-start">
            <bs-button type="primary" plain>top-start</bs-button>
          </bs-popover>
          <bs-popover placement="top" title="top" content="popover显示位置：top">
            <bs-button type="primary" plain>top</bs-button>
          </bs-popover>
          <bs-popover placement="top-end" title="top-end" content="popover显示位置：top-end">
            <bs-button type="primary" plain>top-end</bs-button>
          </bs-popover>
        </div>
        <div class="direction-left-right">
          <div class="direction-left">
            <bs-popover placement="left-start" title="left-start" content="popover显示位置：left-start">
              <bs-button type="primary" plain>left-start</bs-button>
            </bs-popover>
            <bs-popover placement="left" title="left" content="popover显示位置：left">
              <bs-button type="primary" plain>left</bs-button>
            </bs-popover>
            <bs-popover placement="left-end" title="left-end" content="popover显示位置：left-end">
              <bs-button type="primary" plain>left-end</bs-button>
            </bs-popover>
          </div>
          <div class="direction-right">
            <bs-popover placement="right-start" title="right-start" content="popover显示位置：right-start">
              <bs-button type="primary" plain>right-start</bs-button>
            </bs-popover>
            <bs-popover placement="right" title="right" content="popover显示位置：right">
              <bs-button type="primary" plain>right</bs-button>
            </bs-popover>
            <bs-popover placement="right-end" title="right-end" content="popover显示位置：right-end">
              <bs-button type="primary" plain>right-end</bs-button>
            </bs-popover>
          </div>
        </div>
        <div class="direction-bottom">
          <bs-popover placement="bottom-start" title="bottom-start" content="popover显示位置：bottom-start">
            <bs-button type="primary" plain>bottom-start</bs-button>
          </bs-popover>
          <bs-popover placement="bottom" title="bottom" content="popover显示位置：bottom">
            <bs-button type="primary" plain>bottom</bs-button>
          </bs-popover>
          <bs-popover placement="bottom-end" title="bottom-end" content="popover显示位置：bottom-end">
            <bs-button type="primary" plain>bottom-end</bs-button>
          </bs-popover>
        </div>
      </div>
    </div>

    <div>
      <hr>
      <h3>不同的触发方式</h3>
      <bs-popover
        trigger="click"
        title="click触发"
        content="我是由click事件触发！">
        <bs-button
          type="primary">click 触发</bs-button>
      </bs-popover>

      <bs-popover
        title="hover触发"
        content="我是由hover触发！">
        <bs-button
          type="primary"
          style="margin-left: 25px;">hover 触发</bs-button>
      </bs-popover>

      <bs-popover
        trigger="focus"
        title="focus触发"
        content="我是由focus事件触发，鼠标左键按住触发元素不动即可触发，点击页面或页面外任意位置就会隐藏！">
        <bs-button
          type="primary"
          style="margin-left: 25px;">focus 触发（鼠标左键按住我不放）</bs-button>
      </bs-popover>

      <bs-popover
        title="contextmenu触发"
        trigger="contextmenu"
        content="我是由contextmenu事件触发，即鼠标右键触发！">
        <bs-button
          type="primary"
          style="margin-left: 25px;">contextmenu 触发（鼠标右键触发）</bs-button>
      </bs-popover>
    </div>

    <div>
      <hr>
      <h3>自定义内容</h3>
      <bs-popover placement="bottom-start" title="内容使用插槽">
        <bs-button type="primary">内容使用插槽</bs-button>
        <template #content>
          <h6 style="margin-bottom: 5px;font-weight: 600;">自定义内容的popover！</h6>
          <p>
            我是一个使用了<mark style="font-size: 1.5em;padding: 0 5px;"><strong>插槽</strong></mark>的popover！
          </p>
        </template>
      </bs-popover>

      <bs-popover
        title="内容使用HTML文本"
        :content="rawContent"
        :raw-content="true"
        placement="top-start">
        <bs-button type="primary" style="margin-left: 25px;">内容使用HTML文本</bs-button>
      </bs-popover>

      <bs-popover
        placement="top-start">
        <bs-button type="primary" style="margin-left: 25px;">自定义标题</bs-button>
        <template #title>
          一个 <strong style="color: #f00;font-size: 1.5rem;font-weight: bold">不一样</strong> 的标题
        </template>
        <template #content>
          <h3>别看我</h3>
          <p style="padding-left: 50px;padding-right: 100px;">看上面的标题</p>
        </template>
      </bs-popover>

      <bs-popover
        :show-title="false"
        placement="top-start">
        <bs-button type="primary" style="margin-left: 25px;">不显示标题</bs-button>
        <template #title>
          一个 <strong style="color: #f00;font-size: 1.5rem;font-weight: bold">不一样</strong> 的标题
        </template>
        <template #content>
          <h4>啊哦，没有标题了。。。</h4>
        </template>
      </bs-popover>

      <bs-popover
        width="50%"
        title="宽度为50%"
        content="Documentation and examples for adding Bootstrap popovers, like those found in iOS, to any element on your site."
        placement="top-start">
        <bs-button type="primary" style="margin-left: 25px;">自定义宽度</bs-button>
      </bs-popover>
    </div>

    <div>
      <hr>
      <h3>不同过度效果</h3>
      <bs-popover
        title="fade"
        content="默认过渡效果！">
        <bs-button
          type="primary">fade(默认)</bs-button>
      </bs-popover>
      <bs-popover
        transition-name="scale"
        title="scale"
        content="scale的过渡效果！">
        <bs-button
          style="margin-left: 25px;"
          type="primary">scale</bs-button>
      </bs-popover>
    </div>

    <div>
      <hr>
      <h3>受控模式</h3>
      <bs-popover
        :visible="visible1"
        title="受控模式"
        content="我是一个由父组件控制的popover！">
        <bs-button
          type="primary"
          @mouseenter="visible1 = true"
          @mouseleave="visible1 = false">受控的popover</bs-button>
      </bs-popover>
    </div>

    <div>
      <hr>
      <h3>虚拟触发</h3>
      <bs-popover
        virtual-triggering
        virtual-ref="#btn1"
        title="由id为btn1的元素触发"
        content="我由id为btn1的元素触发">
      </bs-popover>
      <bs-popover
        virtual-triggering
        :virtual-ref="getEle"
        title="virtualRef1触发"
        content="我由virtualRef1触发">
      </bs-popover>
      <bs-popover
        virtual-triggering
        :visible="virtualVisible"
        :virtual-ref="virtualRef"
        title="没有实际元素触发"
        content="我真正的虚拟触发！">
      </bs-popover>

      <bs-button id="btn1" type="primary">我的id是btn1</bs-button>
      <bs-button id="btn2" type="primary" style="margin-left: 25px;">我的id是btn2</bs-button>
      <bs-button
        type="primary"
        @click="noDomTriggerClick"
        style="margin-left: 25px;">无dom触发(点击我)</bs-button>
    </div>

    <div>
      <hr>
      <h3>Popper插入到指定dom元素中</h3>
      <div class="popover-container" id="popoverContainer">
        我的文字是红色的！
      </div>
      <bs-popover
        v-if="render1"
        teleported
        append-to="#popoverContainer"
        raw-content
        title="插入到指定dom元素中"
        trigger="click"
        content="看到我的dom在哪了吗？<br>嘻嘻！">
        <bs-button type="primary">点我显示</bs-button>
      </bs-popover>
    </div>

    <div>
      <hr>
      <h3>隐藏即销毁</h3>
      <bs-popover
        destroy-on-hide
        title="隐藏即销毁"
        content="popper隐藏其dom就会被销毁">
        <bs-button type="primary">一个popover</bs-button>
      </bs-popover>
    </div>

    <div class="fixed-box">
      <hr>
      <h3>在fixed定位中</h3>
      <bs-popover
        trigger="click"
        title="在fixed定位中"
        content="trigger在fixed定位中的popover！">
        <bs-button type="primary">一个popover</bs-button>
      </bs-popover>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted
} from 'vue';

export default defineComponent({
  name: 'bs-popoverUsage',
  components: {},
  setup () {
    let visible1 = ref(false);

    let rawContent = `
      <h6 style="margin-bottom: 5px;font-weight: 600;">自定义内容的popover！</h6>
      <p>
        我是一个使用了<mark style="font-size: 1.5em;padding: 0 5px;"><strong>HTML文本</strong></mark>的popover！
      </p>`;

    let position = ref({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    });
    let virtualVisible = ref(false);
    let virtualRef = ref({
      getBoundingClientRect () {
        return position.value;
      }
    });
    let setPosition = (e: MouseEvent) => {
      position.value = DOMRect.fromRect({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY + 10
      });
    };
    let noDomTriggerClick = function () {
      virtualVisible.value = !virtualVisible.value;
      if (virtualVisible.value) {
        document.addEventListener('mousemove', setPosition, false);
      } else {
        document.removeEventListener('mousemove', setPosition, false);
      }
    };

    let getEle = () => {
      return document.getElementById('btn2');
    };
    let render1 = ref(false);

    setTimeout(function () {
      render1.value = true;
    }, 1000);

    return {
      visible1,
      rawContent,
      getEle,
      render1,
      virtualVisible,
      virtualRef,
      noDomTriggerClick
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  min-height: 1500px;
  padding: 3% 10%;
}
.directions-box{
  max-width: 600px;
}
.direction-top,
.direction-bottom{
  text-align: center;
  .bs-button{
    & + .bs-button{
      margin-left: 25px;
    }
  }
}
.direction-left-right{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 20px 0;
}
.direction-left,
.direction-right{
  .bs-button{
    display: block;
    & + .bs-button{
      margin-top: 25px;
    }
  }
}
.popover-container{
  height: 60px;
  line-height: 60px;
  max-width: 600px;
  margin-bottom: 20px;
  color: #f00;
  text-align: center;
  background-color: rgba(64,158, 255, 0.5);
  ::v-deep .bs-popover{
    line-height: 1.5;
    color: #f00;
    font-size: 14px;
  }
}
.fixed-box{
  position: fixed;
  top: 10%;
  right: 2%;
  z-index: 5;
  padding: 20px;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
  background-color: #fff;
}
</style>
<style lang="scss">
.bs-popover{
  &.is-pink{
    box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
    color: #fff;
    background-color: #eb2f96;
  }
}
</style>
