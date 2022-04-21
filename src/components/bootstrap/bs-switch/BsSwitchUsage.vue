<template>
<div class="component-usage">
 <h3>基础用法</h3>
  <div>
    <div>
      值为Boolean类型：<bs-switch v-model="switch1"></bs-switch>
      <span style="margin-left: 15px">值：{{ switch1 }}</span>
    </div>

    <div>
      值为String类型：
      <bs-switch
        v-model="switch1_string"
        active-text="是"
        inactive-text="否"
        active-value="yes"
        inactive-value="no"></bs-switch>
      <span style="margin-left: 15px">值：{{ switch1_string }}</span>
    </div>

    <div>
      值为Number类型：
      <bs-switch
        v-model="switch1_number"
        active-text="数字1"
        inactive-text="数字2"
        :active-value="1"
        :inactive-value="2"></bs-switch>
      <span style="margin-left: 15px">值：{{ switch1_number }}</span>
    </div>

  </div>

  <hr>
  <h3>禁用和loading</h3>
  <div>
    <div style="margin-bottom: 10px;">
      禁用的：<bs-switch v-model="switch2" disabled></bs-switch>
      <bs-switch style="margin-left: 10px;" :model-value="true" disabled></bs-switch>
    </div>

    <div>
      加载中：<bs-switch v-model="switch2" loading></bs-switch>
      <bs-switch style="margin-left: 10px;" :model-value="true" loading></bs-switch>
    </div>
  </div>

  <hr>
  <h3>不同大小</h3>
  <div>
    <div style="margin-bottom: 10px">
      <bs-button type="primary" @click="loadingSize = !loadingSize">切换Loading</bs-button>
    </div>

    <bs-switch
      v-model="switch6"
      :loading="loadingSize"
      size="sm"
      active-text="小的"
      inactive-text="小的"></bs-switch>

    <bs-switch
      v-model="switch6"
      :loading="loadingSize"
      size="sm"
      style="margin-left: 15px;"></bs-switch>

    <bs-switch
      v-model="switch6"
      :loading="loadingSize"
      active-text="默认"
      inactive-text="默认"
      style="margin-left: 15px;"></bs-switch>

    <bs-switch
      v-model="switch6"
      :loading="loadingSize"
      style="margin-left: 15px;"></bs-switch>

    <bs-switch
      v-model="switch6"
      size="lg"
      :loading="loadingSize"
      active-text="大的大的"
      inactive-text="大的大的"
      style="margin-left: 15px;"></bs-switch>

    <bs-switch
      v-model="switch6"
      size="lg"
      :loading="loadingSize"
      style="margin-left: 15px;"></bs-switch>
  </div>

  <hr>
  <h3>打开状态下的不同的颜色</h3>
  <div>
    <bs-switch style="margin-left: 10px;" v-model="switch3" ></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch3" color-type="secondary"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch3" color-type="success"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch3" color-type="warning"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch3" color-type="danger"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch3" active-color="#f00"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch3" active-color="#17161C"></bs-switch>
  </div>

  <hr>
  <h3>未打开状态下的不同颜色</h3>
  <div>
    <bs-switch style="margin-left: 10px;" v-model="switch4"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch4" inactive-color="#f60"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch4" inactive-color="#000"></bs-switch>
    <bs-switch style="margin-left: 10px;" v-model="switch4" inactive-color="green"></bs-switch>
  </div>

  <hr>
  <h3>loading提示的不同颜色</h3>
  <div>
    <bs-switch :model-value="true" loading active-text="Yes"></bs-switch>
    <bs-switch style="margin-left: 10px;" :model-value="false" loading loading-color-type="secondary"></bs-switch>
    <bs-switch style="margin-left: 10px;" :model-value="true" loading loading-color-type="success"></bs-switch>
    <bs-switch style="margin-left: 10px;" :model-value="false" loading loading-color-type="warning"></bs-switch>
    <bs-switch style="margin-left: 10px;" :model-value="true" loading loading-color-type="danger"></bs-switch>
  </div>

  <hr>
  <h3>改变状态前触发条件</h3>
  <div>
    <bs-switch
      v-model="switch5"
      :loading="isStart"
      :extra-data="{name: 'switch'}"
      :before-change="onBeforeChange"></bs-switch>
    <span v-if="!isStart" style="margin-left: 10px;display: inline-block;vertical-align: middle">点击一下开关吧</span>
    <span v-else style="margin-left: 10px;display: inline-block;vertical-align: middle">{{ count }}秒后改变状态</span>
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsSwitchUsage',
  components: {},
  setup (props: any) {
    let switch1 = ref(false);
    // eslint-disable-next-line camelcase
    let switch1_string = ref('yes');
    // eslint-disable-next-line camelcase
    let switch1_number = ref(1);
    let switch2 = ref(false);
    let switch3 = ref(true);
    let switch4 = ref(false);
    let switch5 = ref(false);
    let switch6 = ref(true);

    let isStart = ref(false);
    let count = ref(3);
    let onBeforeChange = function (flag: boolean, extraData: any) {
      console.log('开关中的额外数据', extraData);
      return new Promise(function (resolve) {
        isStart.value = true;
        let timer = setInterval(function () {
          if (count.value == 1) {
            clearInterval(timer);
            resolve(true);
            count.value = 3;
            isStart.value = false;
            return;
          }
          count.value--;
        }, 1000);
      });
    };

    let loadingSize = ref(false);

    return {
      switch1,
      switch1_string,
      switch1_number,
      switch2,
      switch3,
      switch4,
      switch5,
      switch6,
      loadingSize,

      isStart,
      count,
      onBeforeChange
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-tag{
  margin-right: 10px;
}
</style>
