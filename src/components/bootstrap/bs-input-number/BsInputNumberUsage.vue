<template>
<div class="component-usage">
  <div>
    <h3>基础用法</h3>
    <BsInputNumber
      v-model="number1">
      <!--<template #prepend>￥</template>
      <template #append>人</template>-->
    </BsInputNumber>
    <hr>
  </div>

  <div>
    <h3>控制按钮在左右两边</h3>
    <BsInputNumber
      :control-inner="false"
      v-model="number1">
      <!--<template #prepend>￥</template>
      <template #append>人</template>-->
    </BsInputNumber>
    <hr>
  </div>

  <div>
    <h3>最大、最小值限制</h3>
    <BsInputNumber
      v-model="number2"
      :min="2"
      :max="5"></BsInputNumber>

    <BsInputNumber
      style="margin-left: 25px;"
      v-model="number2"
      :min="2"
      :max="5"
      :control-inner="false"></BsInputNumber>
    <hr>
  </div>

  <div class="bs-input-number3">
    <h3>高精度小数</h3>
    <BsInputNumber
      v-model="number3"
      :step="0.00000000000001"></BsInputNumber>
    <hr>
  </div>

  <div>
    <h3>3位小数精度</h3>
    <BsInputNumber
      v-model="number7"
      :precision="3"></BsInputNumber>

    <BsInputNumber
      v-model="number7"
      :precision="3"
      :control-inner="false"
      style="margin-left: 25px;"></BsInputNumber>
    <hr>
  </div>

  <div>
    <h3>不同步长</h3>
    <div style="margin-bottom: 20px;">
      步长为2：
      <BsInputNumber
        v-model="number4"
        :step="2"></BsInputNumber>
    </div>

    <div>
      步长为1.5：
      <BsInputNumber
        v-model="number5"
        :step="1.5"></BsInputNumber>
    </div>

    <hr>
  </div>

  <div>
    <h3>格式化展示</h3>
    <div style="margin-bottom: 15px;">
      <BsInputNumber
        v-model="number10"
        :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\$\s?|(,*)/g, '')"></BsInputNumber>
    </div>
    <div>
      <BsInputNumber
        v-model="number11"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"></BsInputNumber>
    </div>
    <hr>
  </div>

  <div>
    <h3>不同大小</h3>
    <div style="margin-bottom: 20px;">
      大的：<BsInputNumber v-model="number6" size="lg" prefix="￥"></BsInputNumber>
    </div>
    <div style="margin-bottom: 20px;">
      默认：<BsInputNumber v-model="number6" prefix="￥"></BsInputNumber>
    </div>
    <div style="margin-bottom: 20px;">
      小的：<BsInputNumber v-model="number6" size="sm" prefix="￥"></BsInputNumber>
    </div>

    <div style="margin-bottom: 20px;">
      大的：<BsInputNumber v-model="number6" :control-inner="false" size="lg" prefix="￥"></BsInputNumber>
    </div>
    <div style="margin-bottom: 20px;">
      默认：<BsInputNumber v-model="number6" :control-inner="false" prefix="￥"></BsInputNumber>
    </div>
    <div>
      小的：<BsInputNumber v-model="number6" :control-inner="false" size="sm" prefix="￥"></BsInputNumber>
    </div>
    <hr>
  </div>

  <div>
    <h3>添加前缀、后缀</h3>
    <div style="margin-bottom: 20px;">
      <BsInputNumber
        v-model="number8"
        prefix="￥"
        :step="2"></BsInputNumber>

      <BsInputNumber
        style="margin-left: 15px;"
        v-model="number8"
        prefix="￥"
        :control-inner="false"
        :step="2"></BsInputNumber>
    </div>

    <div style="margin-bottom: 20px;">
      <BsInputNumber
        v-model="number8"
        :step="2">
        <template #prepend>￥</template>
      </BsInputNumber>

      <BsInputNumber
        v-model="number8"
        style="margin-left: 15px;"
        :control-inner="false"
        :step="2">
        <template #prepend>￥</template>
      </BsInputNumber>
    </div>

    <div style="margin-bottom: 20px;">
      <BsInputNumber
        v-model="number8"
        :step="2">
        <template #append>￥</template>
      </BsInputNumber>

      <BsInputNumber
        v-model="number8"
        style="margin-left: 15px;"
        :control-inner="false"
        :step="2">
        <template #append>￥</template>
      </BsInputNumber>
    </div>
    <hr>
  </div>

  <div>
    <h3>只读、禁用</h3>

    <div style="margin-bottom: 20px;">
      <BsInputNumber
        v-model="number9"
        prefix="￥"
        disabled></BsInputNumber>
    </div>

    <div style="margin-bottom: 20px;">
      <BsInputNumber
        v-model="number9"
        prefix="￥"
        disabled
        :control-inner="false"></BsInputNumber>
    </div>

    <div style="margin-bottom: 20px;">
      <BsInputNumber
        v-model="number9"
        prefix="￥"
        readonly></BsInputNumber>
    </div>

    <div style="margin-bottom: 20px;">
      <BsInputNumber
        v-model="number9"
        prefix="￥"
        readonly=""
        :control-inner="false"></BsInputNumber>
    </div>
    <hr>
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BsInputNumberUsage',
  components: {},

  setup (props: any) {
    let number1 = ref();
    let number2 = ref(2);
    let number3 = ref(1.00000000000009);
    let number4 = ref();
    let number5 = ref(2.5);
    let number6 = ref();
    let number7 = ref('1.020');
    let number8 = ref(5);
    let number9 = ref(3);
    let number10 = ref(1024);
    let number11 = ref(100);
    return {
      number1,
      number2,
      number3,
      number4,
      number5,
      number6,
      number7,
      number8,
      number9,
      number10,
      number11
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-input-number3{
  ::v-deep .form-control{
    width: 12rem;
  }
}
</style>
