<template>
  <div class="component-usage">
    <!--<div>
      <h3>基本使用</h3>
      <BsCascader
        v-model="cascader1"
        :multiple="false"
        :show-all-levels="true"
        :options="dataOptions1"
        :emit-path="true"
        :check-strictly="false"></BsCascader>
      <div>{{ cascader1 }}</div>
      <bs-button type="primary" @click="removeLastCheckedItem">移除最后一个选中项</bs-button>
      <bs-button type="primary" style="margin-left: 1rem;" @click="addCheckedItem">添加一个选中项</bs-button>
    </div>-->

    <div>
      <h3>懒加载</h3>
      <BsCascader
        v-model="cascader2"
        :multiple="false"
        :show-all-levels="true"
        :options="dataOptions2"
        :emit-path="true"
        lazy
        :lazy-load-fn="lazyLoadFn"
        :check-strictly="false"></BsCascader>
      <div>{{ cascader2 }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import BsCascader from './BsCascader.vue';
import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';
import { options1, options2 } from './test-options';

function randoms (min: number, max: number): number {
  return parseInt((Math.random() * (max - min + 1) + min) + '');
}
export default defineComponent({
  name: 'BsCascaderUsage',
  components: {
    BsCascader
  },
  setup () {
    let dataOptions1 = ref(options1);
    let dataOptions2 = ref(options2);

    let cascader1 = ref<any>(['kekong']);
    let cascader2 = ref<any>([]);
    return {
      dataOptions1,
      dataOptions2,
      cascader1,
      cascader2,
      removeLastCheckedItem () {
        let length = cascader1.value.length;
        if (length > 0) {
          cascader1.value.splice(length - 1, 1);
        }
      },
      addCheckedItem () {
        let values = ['fankui', 'xiaolv', 'kekong', 'daohang', 'cexiangdaohang', 'tag', 'progress', 'tree', 'pagination', 'ziyuan', 'axure', 'sketch', 'jiaohu'];
        let value = values[randoms(0, values.length - 1)];
        console.log('新添加的选中项', value);
        cascader1.value.push(value);
      },
      lazyLoadFn (optionItem: any, setLoadStatus: any) {
        let isFail = randoms(1, 10) % 3 == 0;
        let timer = setTimeout(function () {
          clearTimeout(timer);
          if (isFail) {
            setLoadStatus(false);
            return;
          }
          if (optionItem.children2) {
            optionItem.children = optionItem.children2;
            delete optionItem.children2;
          }
          setLoadStatus(true);
        }, randoms(1000, 2500));
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-cascader{
  max-width: 360px;
}
</style>
