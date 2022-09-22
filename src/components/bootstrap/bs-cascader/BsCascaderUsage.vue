<template>
  <div class="component-usage">
    <div>
      <h3>基本使用</h3>
      <BsCascader
        v-model="cascader1"
        :multiple="true"
        :show-all-levels="true"
        :options="dataOptions1"
        expand-trigger="hover"
        clearable
        :emit-path="true"
        name="aaa"
        :check-strictly="false"></BsCascader>
      <div>{{ cascader1 }}</div>
      <bs-button type="primary" @click="removeLastCheckedItem">移除最后一个选中项</bs-button>
      <bs-button type="primary" style="margin-left: 1rem;" @click="addCheckedItem">添加一个选中项</bs-button>
    </div>

    <!--<div>
      <hr>
      <h3>懒加载</h3>
      <BsCascader
        v-model="cascader2"
        :multiple="true"
        :show-all-levels="true"
        :options="dataOptions2"
        :emit-path="true"
        expand-trigger="click"
        lazy
        :lazy-load-fn="lazyLoadFn"
        :check-strictly="false"></BsCascader>
      <div>{{ cascader2 }}</div>
    </div>-->

    <!--<div>
      <hr>
      <h3>自定义节点内容</h3>
      <BsCascader
        v-model="cascader1"
        :multiple="false"
        :show-all-levels="true"
        :options="dataOptions1"
        :emit-path="true"
        :check-strictly="false">
        <template #label="option">
          {{ option.label }} <small style="color: var(&#45;&#45;success);">（{{ option.children?.length || 0 }}）</small>
        </template>
      </BsCascader>
    </div>-->

    <!--<div>
      <hr>
      <h3>Loading与无数据</h3>
      <h5>Loading</h5>
      <BsCascader
        v-model="cascader1"
        :loading="true"
        :multiple="false"
        :show-all-levels="true"
        :options="dataOptions1"
        :emit-path="true"
        :check-strictly="false">
      </BsCascader>
      <h5>无数据</h5>
      <BsCascader
        v-model="cascader1"
        :multiple="false"
        :show-all-levels="true"
        :options="[]"
        :emit-path="true"
        :check-strictly="false">
      </BsCascader>
    </div>-->

    <!--<div>
      <hr>
      <h3>自定义显示</h3>
      <BsCascader
        v-model="cascader1"
        :filterable="false"
        :multiple="false"
        :show-all-levels="true"
        :options="dataOptions1"
        :emit-path="true"
        :check-strictly="false">
        <bs-button type="primary">点击我吧</bs-button>
      </BsCascader>
    </div>-->

    <!--<div>
      <hr>
      <h3>自定义Tag</h3>
      <h5>自定义Tag内容</h5>
      <BsCascader
        v-model="cascader1"
        :filterable="false"
        :multiple="true"
        :show-all-levels="true"
        :options="dataOptions1"
        :emit-path="true"
        :check-strictly="false">
        <template #tag="tag">
          {{ tag.label }}
          <strong style="color: var(&#45;&#45;success);">(选中项在第{{tag.optionPath.length}}层)</strong>
        </template>
      </BsCascader>
      <h5 style="margin-top: 0.5rem;">自定义Tag类型</h5>
      <BsCascader
        v-model="cascader3"
        :filterable="false"
        :multiple="true"
        :show-all-levels="true"
        :options="dataOptions1"
        :emit-path="true"
        :check-strictly="false"
        tag-type="primary">
      </BsCascader>
      <BsCascader
        style="margin-top: 1rem;"
        v-model="cascader3"
        :filterable="false"
        :multiple="true"
        :show-all-levels="true"
        :options="dataOptions3"
        :emit-path="true"
        :check-strictly="false">
      </BsCascader>
    </div>-->

    <!--<div>
      <hr>
      <h3>禁用</h3>
      <BsCascader
        v-model="cascader1"
        :filterable="false"
        :multiple="true"
        :show-all-levels="true"
        :options="dataOptions1"
        :emit-path="true"
        disabled
        :check-strictly="false">
      </BsCascader>
    </div>-->
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import BsCascader from './BsCascader.vue';
import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';
import { options1, options2, options3 } from './test-options';

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
    let dataOptions3 = ref(options3);

    let cascader1 = ref<any>(['kekong']);
    let cascader2 = ref<any>([]);
    let cascader3 = ref<any>(['kekong', 'float', 'shejiyuanze']);

    return {
      dataOptions1,
      dataOptions2,
      dataOptions3,
      cascader1,
      cascader2,
      cascader3,
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
