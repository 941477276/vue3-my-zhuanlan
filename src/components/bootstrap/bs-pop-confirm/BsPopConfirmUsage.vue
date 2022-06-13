<template>
  <div class="component-usage">
    <div>
      <h3>基础用法</h3>
      <bs-pop-confirm
        trigger="click"
        content="确定要删除吗?"
        @confirm="onConfirm1">
        <bs-button type="primary" plain>确认弹窗</bs-button>
      </bs-pop-confirm>
    </div>

    <div>
      <hr>
      <h3>自定义内容</h3>
      <bs-pop-confirm placement="bottom-start" @confirm="onConfirm1">
        <bs-button type="primary">内容使用插槽</bs-button>
        <template #content>
          <h6 style="margin-bottom: 5px;font-weight: 600;">自定义内容的popover！</h6>
          <p>
            我是一个使用了<mark style="font-size: 1.5em;padding: 0 5px;"><strong>插槽</strong></mark>的popover！
          </p>
        </template>
      </bs-pop-confirm>

      <bs-pop-confirm
        :content="rawContent"
        :raw-content="true"
        placement="top-start"
        @confirm="onConfirm1">
        <bs-button type="primary" style="margin-left: 25px;">内容使用HTML文本</bs-button>
      </bs-pop-confirm>

      <bs-pop-confirm
        width="50%"
        content="Documentation and examples for adding Bootstrap popovers, like those found in iOS, to any element on your site."
        placement="top-start"
        @confirm="onConfirm1">
        <bs-button type="primary" style="margin-left: 25px;">自定义宽度</bs-button>
      </bs-pop-confirm>
    </div>

    <div>
      <hr>
      <h3>受控模式</h3>
      <bs-pop-confirm
        :visible="visible1"
        title="受控模式"
        content="我是一个由父组件控制的popover！">
        <bs-button
          type="primary"
          @mouseenter="visible1 = true"
          @mouseleave="visible1 = false">受控的popover</bs-button>
      </bs-pop-confirm>
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
  name: 'BsPopConfirmUsage',
  components: {},
  setup () {
    let visible1 = ref(false);

    let rawContent = `
      <h6 style="margin-bottom: 5px;font-weight: 600;">自定义内容的popover！</h6>
      <p>
        我是一个使用了<mark style="font-size: 1.5em;padding: 0 5px;"><strong>HTML文本</strong></mark>的popover！
      </p>`;

    let onConfirm1 = function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(true);
        }, 3000);
      });
    };

    return {
      visible1,
      rawContent,

      onConfirm1
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
  ::v-deep .bs-pop-confirm{
    line-height: 1.5;
    color: #f00;
    font-size: 14px;
  }
}
</style>
