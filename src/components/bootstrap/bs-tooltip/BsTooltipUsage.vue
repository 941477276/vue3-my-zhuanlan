<template>
  <div class="component-usage">
    <div>
      <h3>基础用法</h3>
      <BsTooltip
        content="一个Tooltip">
        <bs-button type="primary" plain>tooltip</bs-button>
      </BsTooltip>
    </div>

    <div>
      <hr>
      <h3>不同方向</h3>
      <div class="directions-box">
        <div class="direction-top">
          <bs-tooltip placement="top-start" content="tooltip显示位置：top-start">
            <bs-button type="primary" plain>top-start</bs-button>
          </bs-tooltip>
          <bs-tooltip placement="top" content="tooltip显示位置：top">
            <bs-button type="primary" plain>top</bs-button>
          </bs-tooltip>
          <bs-tooltip placement="top-end" content="tooltip显示位置：top-end">
            <bs-button type="primary" plain>top-end</bs-button>
          </bs-tooltip>
        </div>
        <div class="direction-left-right">
          <div class="direction-left">
            <bs-tooltip placement="left-start" content="tooltip显示位置：left-start">
              <bs-button type="primary" plain>left-start</bs-button>
            </bs-tooltip>
            <bs-tooltip placement="left" content="tooltip显示位置：left">
              <bs-button type="primary" plain>left</bs-button>
            </bs-tooltip>
            <bs-tooltip placement="left-end" content="tooltip显示位置：left-end">
              <bs-button type="primary" plain>left-end</bs-button>
            </bs-tooltip>
          </div>
          <div class="direction-right">
            <bs-tooltip placement="right-start" content="tooltip显示位置：right-start">
              <bs-button type="primary" plain>right-start</bs-button>
            </bs-tooltip>
            <bs-tooltip placement="right" content="tooltip显示位置：right">
              <bs-button type="primary" plain>right</bs-button>
            </bs-tooltip>
            <bs-tooltip placement="right-end" content="tooltip显示位置：right-end">
              <bs-button type="primary" plain>right-end</bs-button>
            </bs-tooltip>
          </div>
        </div>
        <div class="direction-bottom">
          <bs-tooltip placement="bottom-start" content="tooltip显示位置：bottom-start">
            <bs-button type="primary" plain>bottom-start</bs-button>
          </bs-tooltip>
          <bs-tooltip placement="bottom" content="tooltip显示位置：bottom">
            <bs-button type="primary" plain>bottom</bs-button>
          </bs-tooltip>
          <bs-tooltip placement="bottom-end" content="tooltip显示位置：bottom-end">
            <bs-button type="primary" plain>bottom-end</bs-button>
          </bs-tooltip>
        </div>
      </div>
    </div>

    <div>
      <hr>
      <h3>不同的触发方式</h3>
      <BsTooltip
        trigger="click"
        content="我是由click事件触发！">
        <bs-button
          type="primary">click 触发</bs-button>
      </BsTooltip>

      <BsTooltip
        content="我是由hover触发！">
        <bs-button
          type="primary"
          style="margin-left: 25px;">hover 触发</bs-button>
      </BsTooltip>

      <BsTooltip
        trigger="focus"
        content="我是由focus事件触发，鼠标左键按住触发元素不动即可触发，点击页面或页面外任意位置就会隐藏！">
        <bs-button
          type="primary"
          style="margin-left: 25px;">focus 触发（鼠标左键按住我不放）</bs-button>
      </BsTooltip>

      <BsTooltip
        trigger="contextmenu"
        content="我是由contextmenu事件触发，即鼠标右键触发！">
        <bs-button
          type="primary"
          style="margin-left: 25px;">contextmenu 触发（鼠标右键触发）</bs-button>
      </BsTooltip>
    </div>

    <div>
      <hr>
      <h3>自定义内容</h3>
      <BsTooltip placement="bottom-start">
        <bs-button type="primary">内容使用插槽</bs-button>
        <template #content>
          <h6 style="margin-bottom: 5px;font-weight: 600;">自定义内容的Tooltip！</h6>
          <p>
            我是一个使用了<mark style="font-size: 1.5em;padding: 0 5px;"><strong>插槽</strong></mark>的Tooltip！
          </p>
        </template>
      </BsTooltip>

      <BsTooltip
        :content="rawContent"
        :raw-content="true"
        placement="top-start">
        <bs-button type="primary" style="margin-left: 25px;">内容使用HTML文本</bs-button>
      </BsTooltip>
    </div>

    <div>
      <hr>
      <h3>不同主题</h3>
      <BsTooltip
        content="dark主题的Tooltip！">
        <bs-button
          type="primary">dark主题</bs-button>
      </BsTooltip>
      <BsTooltip
        theme="light"
        content="light主题的Tooltip！">
        <bs-button
          style="margin-left: 25px;"
          type="primary">light主题</bs-button>
      </BsTooltip>
    </div>

    <div>
      <hr>
      <h3>受控模式</h3>
      <BsTooltip
        :visible="visible1"
        content="我是一个由父组件控制的Tooltip！">
        <bs-button
          type="primary"
          @mouseenter="visible1 = true"
          @mouseleave="visible1 = false">受控的Tooltip</bs-button>
      </BsTooltip>
    </div>

    <div>
      <hr>
      <h3>虚拟触发</h3>
      <BsTooltip
        virtual-triggering
        virtual-ref="#btn1"
        content="我由id为btn1的元素触发">
      </BsTooltip>
      <BsTooltip
        virtual-triggering
        :virtual-ref="getEle"
        content="我由virtualRef1触发">
      </BsTooltip>
      <BsTooltip
        virtual-triggering
        :visible="virtualVisible"
        :virtual-ref="virtualRef"
        content="我真正的虚拟触发！">
      </BsTooltip>

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
      <div class="tooltip-container" id="tooltipContainer">
        我的文字是红色的！
      </div>
      <BsTooltip
        v-if="render1"
        teleported
        append-to="#tooltipContainer"
        raw-content
        content="看到我的dom在哪了吗？<br>嘻嘻！">
        <bs-button type="primary">一个Tooltip</bs-button>
      </BsTooltip>
    </div>

    <div>
      <hr>
      <h3>隐藏即销毁</h3>
      <BsTooltip
        destroy-on-hide
        content="popper隐藏其dom就会被销毁">
        <bs-button type="primary">一个Tooltip</bs-button>
      </BsTooltip>
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
  name: 'BsTooltipUsage',
  components: {},
  setup () {
    let visible1 = ref(false);

    let rawContent = `
      <h6 style="margin-bottom: 5px;font-weight: 600;">自定义内容的Tooltip！</h6>
      <p>
        我是一个使用了<mark style="font-size: 1.5em;padding: 0 5px;"><strong>HTML文本</strong></mark>的Tooltip！
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
.tooltip-container{
  height: 60px;
  line-height: 60px;
  max-width: 600px;
  margin-bottom: 20px;
  color: #f00;
  text-align: center;
  background-color: rgba(64,158, 255, 0.5);
  ::v-deep .bs-tooltip{
    line-height: 1.5;
    color: #f00;
    font-size: 14px;
  }
}
</style>
