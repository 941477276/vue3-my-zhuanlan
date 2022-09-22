<template>
<div class="component-usage">
  <div>
    <h3>基础用法</h3>
    <bs-button>默认</bs-button>
    <bs-button
      v-for="type in btnTypes"
      :key="type"
      :type="type">{{ type }}</bs-button>
  </div>

  <div>
    <hr>
    <h3>基础用法</h3>
    <bs-button plain>默认</bs-button>
    <bs-button
      v-for="type in btnTypes"
      :key="type"
      :type="type"
      plain>{{ type }}</bs-button>
  </div>

  <div>
    <hr>
    <h3>圆角按钮</h3>
    <bs-button round>默认</bs-button>
    <bs-button
      v-for="type in btnTypes"
      :key="type"
      :type="type"
      round>{{ type }}</bs-button>
  </div>

  <div>
    <hr>
    <h3>平角按钮</h3>
    <bs-button squared>默认</bs-button>
    <bs-button
      v-for="type in btnTypes"
      :key="type"
      :type="type"
      squared>{{ type }}</bs-button>
  </div>

  <div>
    <hr>
    <h3>不同大小</h3>
    <bs-button type="primary" size="sm">小按钮</bs-button>
    <bs-button type="primary">默认大小</bs-button>
    <bs-button type="primary" size="lg">大按钮</bs-button>
  </div>

  <div>
    <hr>
    <h3>块级按钮</h3>
    <bs-button type="primary" block>块级按钮</bs-button>
    <bs-button type="secondary" style="margin-left: 0;" block>块级按钮</bs-button>
    <bs-button type="success" style="margin-left: 0;" block>块级按钮</bs-button>
  </div>

  <div>
    <hr>
    <h3>禁用</h3>
    <bs-button disabled>默认</bs-button>
    <bs-button
      v-for="type in btnTypes"
      :key="type"
      :type="type"
      disabled>{{ type }}</bs-button>
  </div>

  <div>
    <hr>
    <h3>加载中</h3>
    <bs-button loading>默认</bs-button>
    <bs-button
      v-for="type in btnTypes"
      :key="type"
      :type="type"
      loading>{{ type }}</bs-button>
  </div>

  <div>
    <hr>
    <h3>链接按钮</h3>
    <bs-button type="link" tag="a" href="https://www.baidu.com" target="_blank">a标签(跳转到百度)</bs-button>
  </div>

</div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import { supportedBsColorTypes } from '@/ts-tokens/bootstrap';

export default defineComponent({
  name: 'BsButtonUsage',
  setup (props: any) {
    let onClick = function (evt: MouseEvent) {
      console.log(evt);
    };
    let btnTypes = ref([...supportedBsColorTypes]);
    return {
      onClick,
      btnTypes
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-button + .bs-button{
  margin-left: 1rem;
}
</style>
