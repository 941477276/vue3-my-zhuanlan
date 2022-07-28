<template>
<div class="component-usage">
  <div>
    <h3 style="margin-top: 200px;margin-bottom: 15px;">单选</h3>
    <bs-select v-model="selectVal" clearable>
      <bs-option value="a" v-if="show">第1个选项</bs-option>
      <bs-option value="b" label="第2个选项"></bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
      <bs-option :value="4">第4个选项，值为number类型</bs-option>
      <bs-option value="5" :disabled="true">禁用项</bs-option>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3 style="margin-top: 50px;margin-bottom: 15px;">多选</h3>
    <bs-select
      v-model="selectVals"
      multiple
      clearable
      :multiple-limit="4"
      @select-limit="onMultipleLimit">
      <bs-option-group label="组1">
        <bs-option value="group-value1">第1个选项</bs-option>
        <bs-option value="group-value2" label="第2个选项"></bs-option>
        <bs-option :value="3">第3个选项，值为number类型</bs-option>
      </bs-option-group>
      <bs-option value="4">第4个选项</bs-option>
      <bs-option :value="true" label="第5个选项，值为boolean类型"></bs-option>
      <bs-option value="6" :disabled="true">禁用项</bs-option>
      <bs-option-group label="组2">
        <bs-option value="group-value7">第7个选项</bs-option>
        <bs-option value="group-value8" :disabled="true">第8个选项</bs-option>
      </bs-option-group>
      <bs-option-group label="组3（禁用的）" disabled>
        <bs-option value="group-value9">第9个选项</bs-option>
        <bs-option value="group-value10">第10个选项</bs-option>
      </bs-option-group>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>可搜索</h3>
    <h6 style="margin: 0.5rem 0 1rem 0;">单选（可搜索）</h6>
    <bs-select
      v-model="selectVal2"
      clearable
      filterable>
      <bs-option value="option1">第1个选项</bs-option>
      <bs-option value="option2" label="第2个选项"></bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
      <bs-option :value="4">第4个选项，值为number类型</bs-option>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="5" :disabled="true">禁用项</bs-option>
    </bs-select>

    <h6 style="margin: 0.5rem 0 1rem 0;">多选（可搜索）</h6>
    <bs-select
      v-model="selectVal3"
      multiple
      clearable
      filterable>
      <bs-option value="option1">第1个选项</bs-option>
      <bs-option value="option2" label="第2个选项"></bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
      <bs-option :value="4">第4个选项，值为number类型</bs-option>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="5" :disabled="true">禁用项</bs-option>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>异步加载</h3>
    <bs-select
      style="margin-bottom: 1rem;"
      v-model="selectVal4"
      clearable
      filterable
      :loading="loading4">
      <bs-option
        v-for="item in options4"
        :key="item.value"
        :value="item.value">{{ item.label }}</bs-option>
    </bs-select>
    <bs-select
      v-model="selectVal9"
      clearable
      filterable
      multiple
      :loading="loading4">
      <bs-option
        v-for="item in options4"
        :key="item.value"
        :value="item.value">{{ item.label }}</bs-option>
    </bs-select>
    <bs-button type="primary" style="margin-top: 1rem" @click="loadData4">点击加载数据</bs-button>
  </div>

  <div>
    <hr>
    <h3>禁用和不同类型的Tag</h3>
    <h6 style="margin: 0.5rem 0 1rem 0;">禁用——单选</h6>
    <bs-select
      v-model="selectVal5"
      disabled
      filterable>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">禁用——多选</h6>
    <bs-select
      v-model="selectVal6"
      multiple
      disabled
      filterable>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">禁用——多选(部分选项禁用)</h6>
    <bs-select
      v-model="selectVal6"
      multiple
      filterable>
      <bs-option value="html" disabled>Html</bs-option>
      <bs-option value="css" disabled>Css</bs-option>
      <bs-option value="javascript" disabled>Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">不同类型的Tag</h6>
    <bs-select
      v-model="selectVal7"
      multiple
      filterable>
      <bs-option value="html" tag-type="primary">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript" tag-type="success">Javascript</bs-option>
      <bs-option value="vue" tag-type="info">Vue</bs-option>
      <bs-option value="react" tag-class="react-tag">React</bs-option>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>自定义Tag内容</h3>
    <bs-select
      v-model="selectVal8"
      multiple
      filterable>
      <template #tag="tag">
        {{ tag.label }}
        <span style="color: #F95504;font-weight: bold;" v-if="tag.value === 'html'">(超文本传输语言)</span>
        <span style="color: #0EA001;font-weight: bold;" v-if="tag.value === 'css'">(层叠样式表)</span>
        <span style="color: #0E45E8;font-weight: bold;" v-if="tag.value === 'javascript'">(弱类型脚本语言)</span>
      </template>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">溢出Tag</h6>
    <bs-select
      v-model="selectVal8"
      multiple
      filterable
      :max-tag-count="2">
      <template #maxTagPlaceholder="{ omittedCount }">
        隐藏了 <strong style="color: #f30;">{{omittedCount}}</strong> 个Tag
      </template>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { SelectOptionItem } from '@/ts-tokens/bootstrap/select';

export default defineComponent({
  name: 'BsSelectUsage',
  components: {},

  setup (props: any) {
    let show = ref(true);
    let selectVal = ref('');
    let selectVals = ref([]);

    let onMultipleLimit = function (limitCount: number) {
      alert(`最多只能选择${limitCount}项！`);
    };

    let selectVal2 = ref('');
    let selectVal3 = ref(['javascript']);

    let selectVal4 = ref('');
    let selectVal9 = ref(['html', 'javascript']);
    let options4 = ref<SelectOptionItem[]>([]);
    let loading4 = ref(true);
    let loadData4 = function () {
      loading4.value = true;
      let timer = setTimeout(function () {
        clearTimeout(timer);
        loading4.value = false;
        options4.value = [
          { id: '1', label: 'Html', value: 'html' },
          { id: '2', label: 'Css', value: 'css' },
          { id: '3', label: 'Javascript', value: 'javascript' },
          { id: '4', label: 'Vue', value: 'vue' }
        ];
      }, 1500);
    };

    let selectVal5 = ref('html');
    let selectVal6 = ref(['html', 'javascript']);
    let selectVal7 = ref(['html', 'javascript', 'css', 'vue', 'react']);

    let selectVal8 = ref(['html', 'javascript', 'css', 'vue', 'react']);

    return {
      show,
      selectVal,
      selectVals,
      onMultipleLimit,

      selectVal2,
      selectVal3,

      selectVal4,
      selectVal9,
      options4,
      loading4,
      loadData4,

      selectVal5,
      selectVal6,
      selectVal7,
      selectVal8
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-select{
  //width: auto;
  max-width: 260px;
}
:deep(.react-tag){
  border-color: #61DAFB!important;
  background-color: #61DAFB!important;
  color: #fff!important;
}
</style>
